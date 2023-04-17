const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

let persons = [
    {id: 1,
    name: "Arto Hellas",
    number: "040-123456"},
    {id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323423"},
    {id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"},
    {id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"}
]

app.get('/info', (req, res) => {
    const body = `<div><p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p></div>`
    res.send(body)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
        res.json(person)
    }else{
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const newPerson = req.body
    if(!newPerson.number){
        return res.status(400).json({error:'no number provided'})
    }else{
        const person = persons.find(person => person.name === newPerson.name)
        if(person){
            return res.status(400).json({error:'name must be unique'})
        }else{
            const id = Math.round(Math.random() * 100000)
            newPerson.id = id
            persons = persons.concat(newPerson)
            res.status(200).end()
        }
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
