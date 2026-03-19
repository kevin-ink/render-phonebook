const personsRouter = require('express').Router()
const Person = require('../models/person')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

//
// ROUTES
//

// GET ALL PERSONS
personsRouter.get('/', async (request, response) => {
  const persons = await Person.find({}).populate('user', {
    username: 1,
    name: 1,
  })
  response.json(persons)
})

// // GET NUMBER OF PEOPLE IN PHONEBOOK AND REQUEST DATE
// app.get('/info', (request, response) => {
//   Person.find({}).then((persons) => {
//     response.send(
//       `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`,
//     )
//   })
// })

// GET PERSON BY ID
personsRouter.get('/:id', async (request, response) => {
  const foundPerson = await Person.findById(request.params.id)

  if (foundPerson) {
    response.json(foundPerson)
  } else {
    response.status(404).end()
  }
})

// DELETE PERSON
personsRouter.delete('/:id', async (request, response) => {
  await Person.findByIdAndDelete(request.params.id)

  response.status(204).end()
})

// ADD PERSON
personsRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    user: user._id,
  })

  const savedPerson = await person.save()
  user.phonebook = user.phonebook.concat(savedPerson._id)
  await user.save()
  response.status(201).json(savedPerson)
})

// UPDATE
personsRouter.put('/:id', async (request, response) => {
  const { number } = request.body

  let foundPerson = await Person.findById(request.params.id)
  if (!foundPerson) {
    return response.status(404).end()
  }

  foundPerson.number = number
  const updatedPerson = await foundPerson.save()
  response.json(updatedPerson)
})

module.exports = personsRouter
