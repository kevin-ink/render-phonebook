const { test, beforeEach, after, describe, before } = require('node:test')
const supertest = require('supertest')
const assert = require('node:assert')
const Person = require('../models/person')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')

describe('testing token authentication', () => {
  let token
  let user

  before(async () => {
    const loginData = await helper.loginAndGetToken(api)
    token = loginData.token
    user = loginData.user
  })

  beforeEach(async () => {
    await Person.deleteMany({})
    await User.updateOne({ _id: user._id }, { phonebook: [] })

    const personObjects = helper.initialPersons.map(
      (person) => new Person({ ...person, user: user._id }),
    )

    const insertedPersons = await Person.insertMany(personObjects)
    const personIds = insertedPersons.map((person) => person._id)
    await User.findByIdAndUpdate(user._id, { phonebook: personIds })
  })

  test('get persons succeeds without token', async () => {
    await api
      .get('/api/persons')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('adding a person fails with 401 if token is not provided', async () => {
    const newPerson = {
      name: 'John Doe',
      number: '555-5555555',
    }
    await api.post('/api/persons').send(newPerson).expect(401)
  })

  test('adding a person succeeds with valid token', async () => {
    const newPerson = {
      name: 'Jane Doe',
      number: '444-4444444',
    }

    await api
      .post('/api/persons')
      .set('Authorization', `Bearer ${token}`)
      .send(newPerson)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const personsAtEnd = await helper.personsInDb()
    assert.strictEqual(personsAtEnd.length, helper.initialPersons.length + 1)
  })

  test('deleting a person succeeds with valid token', async () => {
    const personsAtStart = await helper.personsInDb()
    const personToDelete = personsAtStart[0]

    await api
      .delete(`/api/persons/${personToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const personsAtEnd = await helper.personsInDb()
    assert.strictEqual(personsAtEnd.length, helper.initialPersons.length - 1)

    const names = personsAtEnd.map((p) => p.name)
    assert.ok(!names.includes(personToDelete.name))
  })

  test('deleting a person fails with 403 if user does not own the person', async () => {
    const newUser = {
      username: 'otheruser',
      password: 'password123',
    }

    await api.post('/api/users').send(newUser)

    const loginRes = await api.post('/api/login').send(newUser)
    const otherToken = loginRes.body.token

    const personsAtStart = await helper.personsInDb()
    const personToDelete = personsAtStart[0]

    await api
      .delete(`/api/persons/${personToDelete.id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403)

    const personsAtEnd = await helper.personsInDb()
    assert.strictEqual(personsAtEnd.length, helper.initialPersons.length)
  })

  test('updating a person succeeds with valid token', async () => {
    const personsAtStart = await helper.personsInDb()
    const personToUpdate = personsAtStart[0]

    const updatedData = {
      name: personToUpdate.name,
      number: '999-9999999',
    }

    await api
      .put(`/api/persons/${personToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const personsAtEnd = await helper.personsInDb()
    const updatedPerson = personsAtEnd.find((p) => p.id === personToUpdate.id)
    assert.strictEqual(updatedPerson.number, updatedData.number)
  })

  test('updating a person fails with 403 if user does not own the person', async () => {
    const newUser = {
      username: 'anotheruser',
      password: 'password456',
    }
    await api.post('/api/users').send(newUser)

    const loginRes = await api.post('/api/login').send(newUser)
    const otherToken = loginRes.body.token

    const personsAtStart = await helper.personsInDb()
    const personToUpdate = personsAtStart[0]

    const updatedData = {
      name: personToUpdate.name,
      number: '888-8888888',
    }
    await api
      .put(`/api/persons/${personToUpdate.id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send(updatedData)
      .expect(403)

    const personsAtEnd = await helper.personsInDb()
    const unchangedPerson = personsAtEnd.find((p) => p.id === personToUpdate.id)
    assert.strictEqual(unchangedPerson.number, personToUpdate.number)
  })

  after(async () => {
    await User.deleteMany({})
    await Person.deleteMany({})
    await mongoose.connection.close()
  })
})
