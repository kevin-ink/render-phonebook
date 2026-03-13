require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

// SETUP
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
)
app.use(cors())
app.use(express.static('dist'))

//
// ROUTES
//

// GET ALL PERSONS
app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

// GET NUMBER OF PEOPLE IN PHONEBOOK AND REQUEST DATE
app.get('/info', (request, response) => {
  Person.find({}).then((persons) => {
    response.send(
      `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`,
    )
  })
})

// GET PERSON BY ID
app.get('/api/persons/:id', (request, response, next) => {
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
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

// ADD PERSON
app.post('/api/persons', (request, response, next) => {
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
app.put('/api/persons/:id', (request, response) => {
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

//
// ERROR HANDLING
//
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// LISTEN
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
