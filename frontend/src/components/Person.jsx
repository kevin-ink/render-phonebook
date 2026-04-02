const Person = ({ person, handleDeletePerson }) => {
  const onDeleteClick = (e) => {
    e.preventDefault()
    handleDeletePerson(person)
  }

  return (
    <div>
      {person.name} {person.number}
      <button onClick={onDeleteClick}>remove</button>
    </div>
  )
}

export default Person
