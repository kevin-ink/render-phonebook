const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const api = supertest(app)
const helper = require('./test_helper')
const Person = require('../models/person')

beforeEach(async () => {
  await Person.deleteMany({})

  await Person.insertMany(helper.initialPersons)
})

test('persons are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

after(async () => {
  await mongoose.connection.close()
})

test('all persons are returned', async () => {
  const response = await api.get('/api/persons')

  assert.strictEqual(response.body.length, helper.initialPersons.length)
})

test('a specific person is within the returned persons', async () => {
  const response = await api.get('/api/persons')

  const names = response.body.map((e) => e.name)
  assert(names.includes('Anna Hutcherson'), true)
})

test('a valid person can be added', async () => {
  const newPerson = {
    name: 'Jelly Parker',
    number: '123-679384934',
  }

  await api
    .post('/api/persons')
    .send(newPerson)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const personsAtEnd = await helper.personsInDb()
  assert.strictEqual(personsAtEnd.length, helper.initialPersons.length + 1)

  const names = personsAtEnd.map((p) => p.name)
  assert(names.includes('Jelly Parker'))
})

test('an invalid person cannot be added', async () => {
  const newPerson = {
    name: 'i',
    number: '23123122312312312',
  }

  await api.post('/api/persons').send(newPerson).expect(400)

  const personsAtEnd = await helper.personsInDb()
  assert.strictEqual(personsAtEnd.length, helper.initialPersons.length)
})

test('a specific person can be viewed', async () => {
  const personsAtStart = await helper.personsInDb()
  const personToView = personsAtStart[0]

  const resultPerson = await api
    .get(`/api/persons/${personToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultPerson.body, personToView)
})

test('a specific person can be deleted', async () => {
  const personsAtStart = await helper.personsInDb()
  const personToDelete = personsAtStart[0]

  await api.delete(`/api/persons/${personToDelete.id}`).expect(204)

  const personsAtEnd = await helper.personsInDb()

  const ids = personsAtEnd.map((p) => p.id)
  assert(!ids.includes(personToDelete.id))

  assert.strictEqual(personsAtEnd.length, helper.initialPersons.length - 1)
})

test('a person can be updated', async () => {
  const personsAtStart = await helper.personsInDb()
  const personToUpdate = personsAtStart[0]

  const updatedPersonData = {
    number: '999-888777',
  }

  const updatedPerson = await api
    .put(`/api/persons/${personToUpdate.id}`)
    .send(updatedPersonData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(updatedPerson.body.number, updatedPersonData.number)
})
