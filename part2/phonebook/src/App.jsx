import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, type: 'success' })

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: 'success' })
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find((person) => person.name === newName)

    if (!existingPerson) {
      const personObject = { name: newName, number: newNumber }
      personService
        .create(personObject)
        .then((createdPerson) => {
          setPersons(persons.concat(createdPerson))
          setNewName('')
          setNewNumber('')
          showNotification(`Added ${createdPerson.name}`)
        })
        .catch(() => {
          showNotification('Failed to add person', 'error')
        })
      return
    }

    const shouldUpdate = window.confirm(
      `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`,
    )

    if (!shouldUpdate) {
      return
    }

    const updatedPerson = { ...existingPerson, number: newNumber }
    personService
      .update(existingPerson.id, updatedPerson)
      .then((returnedPerson) => {
        setPersons(persons.map((person) => (person.id === existingPerson.id ? returnedPerson : person)))
        setNewName('')
        setNewNumber('')
        showNotification(`Updated ${returnedPerson.name}`)
      })
      .catch(() => {
        setPersons(persons.filter((person) => person.id !== existingPerson.id))
        showNotification(
          `Information of ${existingPerson.name} has already been removed from server`,
          'error',
        )
      })
  }

  const deletePerson = (id) => {
    const person = persons.find((entry) => entry.id === id)
    if (!person) {
      return
    }

    const shouldDelete = window.confirm(`Delete ${person.name}?`)
    if (!shouldDelete) {
      return
    }

    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter((entry) => entry.id !== id))
        showNotification(`Deleted ${person.name}`)
      })
      .catch(() => {
        setPersons(persons.filter((entry) => entry.id !== id))
        showNotification(`Information of ${person.name} was already removed from server`, 'error')
      })
  }

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(nameFilter.toLowerCase()),
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter value={nameFilter} onChange={(event) => setNameFilter(event.target.value)} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        nameValue={newName}
        numberValue={newNumber}
        onNameChange={(event) => setNewName(event.target.value)}
        onNumberChange={(event) => setNewNumber(event.target.value)}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} onDelete={deletePerson} />
    </div>
  )
}

export default App