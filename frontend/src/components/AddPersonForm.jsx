import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AddPersonForm = ({ createPerson }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const navigate = useNavigate()

  const handleAddPerson = (e) => {
    e.preventDefault()

    createPerson({
      name: newName,
      number: newNumber,
    })

    setNewName('')
    setNewNumber('')
    navigate('/persons')
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
