import { useState, useEffect } from 'react'
import personService from './services/person'
import loginService from './services/login'
import Person from './components/Person'
import LoginForm from './components/LoginForm'
import AddPersonForm from './components/AddPersonForm'
import Home from './components/Home'
import Alert from './components/Alert'

import { Routes, Route, Link, useMatch } from 'react-router-dom'
import PersonList from './components/PersonList'

const App = () => {
  const [persons, setPersons] = useState([])
  const [notification, setNotification] = useState({ type: '', message: '' })
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedPhonebookAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      personService.setToken(user.token)
      return user
    }
    return null
  })

  const match = useMatch('/persons/:id')
  const person = match ? persons.find((p) => p.id === match.params.id) : null

  useEffect(() => {
    if (!user) return

    personService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons)
      })
      .catch((error) => {
        console.log(error)
        if (error.response?.status === 401) {
          handleLogout()
        } else {
          setNotification({
            type: 'error',
            message: 'Failed to fetch persons: ' + error.message,
          })
          setTimeout(() => {
            setNotification({ type: '', message: '' })
          }, 5000)
        }
      })
  }, [user])

  const handleLogin = (username, password) => {
    loginService
      .login({ username, password })
      .then((user) => {
        window.localStorage.setItem(
          'loggedPhonebookAppUser',
          JSON.stringify(user),
        )

        personService.setToken(user.token)
        setUser(user)
      })
      .catch(() => {
        setNotification({ type: 'error', message: 'wrong credentials' })
        setTimeout(() => {
          setNotification({ type: '', message: '' })
        }, 5000)
      })
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedPhonebookAppUser')
    personService.setToken(null)
    setUser(null)
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
        // console.log(error.response.data.error)
        setNotification({
          type: 'error',
          message: 'failed to create person: ' + error.response.data.error,
        })
        setTimeout(() => {
          setNotification({ type: '', message: '' })
        }, 5000)
      })
  }

  const padding = {
    padding: 5,
  }

  return (
    <>
      <Alert type={notification.type} message={notification.message} />
      <h1>Phonebook</h1>
      {!user && <LoginForm handleLogin={handleLogin} />}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <div>
            <Link style={padding} to="/">
              home
            </Link>
            <Link style={padding} to="/persons">
              persons
            </Link>
            <Link style={padding} to="/create">
              new person
            </Link>
          </div>

          <Routes>
            <Route
              path="/persons/:id"
              element={
                <Person
                  person={person}
                  handleDeletePerson={handleDeletePerson}
                />
              }
            />
            <Route
              path="/persons"
              element={
                <PersonList
                  persons={persons}
                  handleDeletePerson={handleDeletePerson}
                />
              }
            />
            <Route
              path="/create"
              element={<AddPersonForm createPerson={createPerson} />}
            />
            <Route path="/" element={<Home />} />
          </Routes>
          {/* <Footer /> */}
        </div>
      )}
    </>
  )
}

export default App
