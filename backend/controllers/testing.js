const router = require('express').Router()
const Person = require('../models/person')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  await Person.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router
