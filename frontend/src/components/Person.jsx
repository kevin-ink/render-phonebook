import { useParams, useNavigate } from 'react-router-dom'

const Person = ({ person, handleDeletePerson }) => {
  const id = useParams().id
  const navigate = useNavigate()

  const onDeleteClick = (e) => {
    e.preventDefault()
    if (window.confirm(`Delete person "${person.name}"?`)) {
      handleDeletePerson(person)
      navigate('/persons')
    }
  }

  if (!person) {
    return null
  }

  return (
    <div>
      {person.name} {person.number}
      <button onClick={onDeleteClick}>remove</button>
    </div>
  )
}

export default Person
