const Person = require('../models/person')
const User = require('../models/user')

const initialPersons = [
  {
    name: 'Anna Hutcherson',
    number: '123-456789',
  },
  {
    name: 'Anne Hickinson',
    number: '789-10111213',
  },
]

const user = {
  username: 'testuser',
  password: 'password',
}

const loginAndGetToken = async (api) => {
  await api.post('/api/users').send(user)

  const res = await api.post('/api/login').send(user)

  const savedUser = await User.findOne({ username: user.username })

  return {
    token: res.body.token,
    user: savedUser,
  }
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

const personsInDb = async () => {
  const persons = await Person.find({})
  return persons.map((person) => person.toJSON())
}

// const nonExistingId = async () => {
//   const person = new Person({
//     name: 'willremovethissoon',
//     number: '123-456789',
//   })
//   await person.save()
//   await person.deleteOne()

//   return person._id.toString()
// }

module.exports = {
  initialPersons,
  // nonExistingId,
  personsInDb,
  usersInDb,
  loginAndGetToken,
}
