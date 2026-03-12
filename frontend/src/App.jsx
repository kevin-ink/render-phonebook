import { useState, useEffect } from "react";
import personsService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterByName, setFilterByName] = useState("");

  useEffect(() => {
    personsService.getAll().then((res) => {
      setPersons(res.data);
    });
  }, []);

  const handleDeletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService.ddelete(id).then(() => {
        setPersons((prev) => prev.filter((p) => p.id !== id));
      });
    }
  };

  const handleAddPerson = (e) => {
    e.preventDefault();

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    const existingPerson = persons.find(
      (person) => person.name === newName.trim(),
    );

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} already exists in the phonebook, replace the old number with a new one?`,
        )
      ) {
        personsService.update(existingPerson.id, newPerson).then((res) => {
          setPersons(
            persons.map((p) => (p.id !== existingPerson.id ? p : res.data)),
          );
          setNewName("");
          setNewNumber("");
        });
      }
      return;
    } else if (persons.some((person) => person.number === newNumber.trim())) {
      alert(`The number ${newNumber} already exists in the phonebook`);
      return;
    }

    personsService.create(newPerson).then((res) => {
      setPersons(persons.concat(res.data));
      setNewName("");
      setNewNumber("");
    });
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filterByName.toLowerCase()),
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with
        <input
          onChange={(e) => setFilterByName(e.target.value)}
          value={filterByName}
        />
      </div>
      <form>
        <h2>add a new</h2>
        <div>
          name:{" "}
          <input onChange={(e) => setNewName(e.target.value)} value={newName} />
        </div>
        <div>
          number:{" "}
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
      <h2>Numbers</h2>
      {filteredPersons.map((person, i) => {
        return (
          <div key={i}>
            {person.name} {person.number}{" "}
            <button onClick={() => handleDeletePerson(person.id, person.name)}>
              delete
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default App;
