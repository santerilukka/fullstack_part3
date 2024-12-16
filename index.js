require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

app.use(morgan(':method :url :status :response-time ms - :postData'));
morgan.token('postData', (req) => JSON.stringify(req.body));



app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      console.log(persons)
      response.json(persons)
    })
  })

app.get('/info', (request, response) => {
    const amount = String(persons.length)
    const currentDate = new Date().toString()
    const text = `<p>Phonebook has info for ${amount} people<p/> <br>${currentDate}`
    
    response.send(text)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
  
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Nimi tai numero puuttuu'})
    } else if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'Nimen on oltava uniikki'})
    }

    const person = {
        id: Math.floor(Math.random() * 1000000),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
  })

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})