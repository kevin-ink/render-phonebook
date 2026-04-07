const personsRouter = require('express').Router()
const Person = require('../models/person')
const middleware = require('../utils/middleware')

//
// ROUTES
//

// GET ALL PERSONS
personsRouter.get('/', middleware.authExtractor, async (request, response) => {
  const user = request.user
  const persons = await Person.find({ user: user._id }).populate('user', {
    username: 1,
    name: 1,
  })
  response.json(persons)
})

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
personsRouter.delete(
  '/:id',
  middleware.authExtractor,
  async (request, response) => {
    const user = request.user
    const personToDelete = await Person.findById(request.params.id)

    if (!personToDelete) {
      return response.status(404).json({ error: 'Person not found' })
    }

    if (personToDelete.user.toString() !== user._id.toString()) {
      return response
        .status(403)
        .json({ error: 'You do not have permission to delete this person' })
    }

    await Person.findByIdAndDelete(request.params.id)
    user.phonebook = user.phonebook.filter(
      (p) => p.toString() !== request.params.id,
    )

    await user.save()
    response.status(204).end()
  },
)

// ADD PERSON
personsRouter.post('/', middleware.authExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

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
personsRouter.put(
  '/:id',
  middleware.authExtractor,
  async (request, response) => {
    const user = request.user
    const { number } = request.body

    let foundPerson = await Person.findById(request.params.id)
    if (!foundPerson) {
      return response.status(404).end()
    }

    if (foundPerson.user.toString() !== user._id.toString()) {
      return response
        .status(403)
        .json({ error: 'You do not have permission to update this person' })
    }

    foundPerson.number = number
    const updatedPerson = await foundPerson.save()
    response.json(updatedPerson)
  },
)

module.exports = personsRouter

// // GET NUMBER OF PEOPLE IN PHONEBOOK AND REQUEST DATE
// app.get('/info', (request, response) => {
//   Person.find({}).then((persons) => {
//     response.send(
//       `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`,
//     )
//   })
// })
