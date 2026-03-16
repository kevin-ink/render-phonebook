const personsRouter = require('express').Router()
const Person = require('../models/person')

//
// ROUTES
//

// GET ALL PERSONS
personsRouter.get('/', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
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
personsRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => {
      next(error)
    })
})

// DELETE PERSON
personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

// ADD PERSON
personsRouter.post('/', (request, response, next) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  const person = new Person({
    name: name,
    number: number,
  })

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
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
