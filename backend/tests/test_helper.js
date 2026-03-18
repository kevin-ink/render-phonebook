const Person = require('../models/person')

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

// const nonExistingId = async () => {
//   const person = new Person({
//     name: 'willremovethissoon',
//     number: '123-456789',
//   })
//   await person.save()
//   await person.deleteOne()

//   return person._id.toString()
// }

const personsInDb = async () => {
  const persons = await Person.find({})
  return persons.map((note) => note.toJSON())
}

module.exports = {
  initialPersons,
  // nonExistingId,
  personsInDb,
}
