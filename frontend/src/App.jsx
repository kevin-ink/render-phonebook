import { useState, useEffect } from 'react'
import personService from './services/person'
import loginService from './services/login'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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
      setPersons(res.data)
    })
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedPhonebookAppUser',
        JSON.stringify(user),
      )
      personService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleDeletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id).then(() => {
        setPersons((prev) => prev.filter((p) => p.id !== id))
      })
    }
  }

  const handleAddPerson = (e) => {
    e.preventDefault()

    const newPerson = {
      name: newName,
      number: newNumber,
    }

    const existingPerson = persons.find(
      (person) => person.name === newName.trim(),
    )

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} already exists in the phonebook, replace the old number with a new one?`,
        )
      ) {
        personService.update(existingPerson.id, newPerson).then((res) => {
          setPersons(
            persons.map((p) => (p.id !== existingPerson.id ? p : res.data)),
          )
          setNewName('')
          setNewNumber('')
        })
      }
      return
    } else if (persons.some((person) => person.number === newNumber.trim())) {
      alert(`The number ${newNumber} already exists in the phonebook`)
      return
    }

    personService
      .create(newPerson)
      .then((res) => {
        setPersons(persons.concat(res.data))
        setNewName('')
        setNewNumber('')
      })
      .catch((error) => {
        console.log(error.response.data.error)
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

  const noteForm = () => (
    <>
      <form>
        <h2>add a new</h2>
        <div>
          name:{' '}
          <input onChange={(e) => setNewName(e.target.value)} value={newName} />
        </div>
        <div>
          number:{' '}
          <input
            onChange={(e) => setNewNumber(e.target.value)}
            value={newNumber}
          />
        </div>
        <div>
          <button onClick={handleAddPerson} type="submit">
            add
          </button>
        </div>
      </form>
    </>
  )

  const loginForm = () => (
    <>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filterByName.toLowerCase()),
  )

  return (
    <div>
      {errorMessage && errorDisplay()}
      <h1>Phonebook</h1>
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          {noteForm()}
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
      {filteredPersons.map((person, i) => {
        return (
          <div key={i}>
            {person.name} {person.number}{' '}
            <button onClick={() => handleDeletePerson(person.id, person.name)}>
              delete
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default App
