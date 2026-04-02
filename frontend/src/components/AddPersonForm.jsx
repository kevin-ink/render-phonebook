import { useState } from 'react'

const AddPersonForm = ({ createPerson }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleAddPerson = (e) => {
    e.preventDefault()

    createPerson({
      name: newName,
      number: newNumber,
    })

    setNewName('')
    setNewNumber('')
  }

  return (
    <form onSubmit={handleAddPerson}>
      <h2>add a new number</h2>
      <div>
        <label>
          name
          <input onChange={(e) => setNewName(e.target.value)} value={newName} />
        </label>
      </div>
      <div>
        <label>
          number
          <input
            onChange={(e) => setNewNumber(e.target.value)}
            value={newNumber}
          />
        </label>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default AddPersonForm
