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

app.get('/info', (request, response, next) => {
    Person.countDocuments({})
    .then(count => {
        const currentDate = new Date().toString()
        const text = `<p>Phonebook has info for ${count} people<p/> <br>${currentDate}`
        console.log(text)
        response.send(text)
    })
    .catch(error => next(error))
    
    
    /*const amount = String(persons.length)
    const currentDate = new Date().toString()
    const text = `<p>Phonebook has info for ${amount} people<p/> <br>${currentDate}`
    
    response.send(text)*/
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
  })

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        console.log(savedPerson)
        response.json(savedPerson)
    })
  })

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}
  
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})