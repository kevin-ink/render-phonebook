import { useState, useEffect } from 'react'
import personService from './services/person'
import loginService from './services/login'
import Person from './components/Person'
import LoginForm from './components/LoginForm'
import AddPersonForm from './components/AddPersonForm'

const App = () => {
  const [persons, setPersons] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedPhonebookAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      personService.setToken(user.token)
      return user
    }
    return null
  })
  const [filterByName, setFilterByName] = useState('')

  useEffect(() => {
    personService.getAll().then((res) => {
      setPersons(res)
    })
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedPhonebookAppUser',
        JSON.stringify(user),
      )
      personService.setToken(user.token)
      setUser(user)
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const handleDeletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(person.id).then(() => {
        setPersons((prev) => prev.filter((p) => p.id !== person.id))
      })
    }
  }

  const createPerson = (newPerson) => {
    const existingPerson = persons.find(
      (person) => person.name === newPerson.name.trim(),
    )

    if (existingPerson) {
      if (
        window.confirm(
          `${newPerson.name} already exists in the phonebook, replace the old number with a new one?`,
        )
      ) {
        personService.update(existingPerson.id, newPerson).then((res) => {
          setPersons(persons.map((p) => (p.id !== existingPerson.id ? p : res)))
        })
      }
      return
    } else if (
      persons.some((person) => person.number === newPerson.number.trim())
    ) {
      alert(`The number ${newPerson.number} already exists in the phonebook`)
      return
    }

    personService
      .create(newPerson)
      .then((res) => {
        setPersons(persons.concat(res))
      })
      .catch((error) => {
        console.log(error.response.data.error)
        setErrorMessage('failed to create person: ' + error.response.data.error)
        setTimeout(() => {
          setErrorMessage('')
        }, 5000)
      })
  }

  const errorDisplay = () => (
    <div
      style={{
        color: 'red',
        border: '2px solid red',
        borderRadius: '4px',
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: '#ffe6e6',
      }}
    >
      {errorMessage}
    </div>
  )

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filterByName.toLowerCase()),
  )

  return (
    <div>
      {errorMessage && errorDisplay()}
      <h1>Phonebook</h1>
      {!user && <LoginForm handleLogin={handleLogin} />}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <AddPersonForm createPerson={createPerson} />
        </div>
      )}
      <h2>Numbers</h2>
      <div>
        filter shown with{' '}
        <input
          onChange={(e) => setFilterByName(e.target.value)}
          value={filterByName}
        />
      </div>
      {filteredPersons.map((person) => {
        return (
          <Person
            key={person.id}
            person={person}
            handleDeletePerson={handleDeletePerson}
          />
        )
      })}
    </div>
  )
}

export default App
