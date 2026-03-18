const personsRouter = require('express').Router()
const Person = require('../models/person')

//
// ROUTES
//

// GET ALL PERSONS
personsRouter.get('/', async (request, response) => {
  const persons = await Person.find({})
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

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  const savedPerson = await person.save()
  response.status(201).json(savedPerson)
})

// UPDATE
personsRouter.put('/:id', (request, response) => {
  const { number } = request.body

  Person.findById(request.params.id).then((person) => {
    if (!person) {
      return response.status(404).end()
    }

    person.number = number

    return person.save().then((updatedPerson) => {
      response.json(updatedPerson)
    })
  })
})

module.exports = personsRouter
