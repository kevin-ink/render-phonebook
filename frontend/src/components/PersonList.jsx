import { useState } from 'react'
import Person from './Person'
import { Link } from 'react-router-dom'

const PersonList = ({ persons }) => {
  const [filterByName, setFilterByName] = useState('')

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filterByName.toLowerCase()),
  )

  return (
    <div>
      <h2>numbers</h2>
      <div>
        filter shown with{' '}
        <input
          onChange={(e) => setFilterByName(e.target.value)}
          value={filterByName}
        />
      </div>
      <ul
        style={{
          listStyle: 'none',
          paddingLeft: 0,
        }}
      >
        {filteredPersons.map((person) => (
          <li key={person.id}>
            <Link to={`/persons/${person.id}`}>
              {person.name} {person.number}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PersonList
