require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

const Contact = require('./models/contact')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

app.get('/info', (req, res) => {
    Contact.find({}).then(contacts => {
        const body = `<div><p>Phonebook has info for ${contacts.length} people</p>
    <p>${Date()}</p></div>`
        res.send(body)
    })
})

app.get('/api/persons', (req, res) => {
    Contact.find({}).then(contacts => {
        res.json(contacts)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Contact.findById({_id: req.params.id})
        .then(contact => {
            if(contact){
                res.json(contact)
            }else{
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    /*
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()*/
    Contact.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const newPerson = req.body
    if(!newPerson.name){
        return res.status(400).json({error:'no name provided'})
    }
    if(!newPerson.number){
        return res.status(400).json({error:'no number provided'})
    }else{
        /*const person = persons.find(person => person.name === newPerson.name)
        if(person){
        return res.status(400).json({error:'name must be unique'})
        }else{
            //const id = Math.round(Math.random() * 100000)
            const returnPerson = JSON.parse(JSON.stringify(newPerson))
            newPerson.id = id
            persons = persons.concat(newPerson)
            return res.status(200).json({returnPerson})
        }*/
        const contact = new Contact({
            name: newPerson.name,
            number: newPerson.number
        })
        contact.save()
            .then(savedContact => {
                res.json(savedContact)
            })
            .catch( error => next(error) )
    }
})

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body

    Contact.findByIdAndUpdate(req.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
        .then(updatedContact => {
            res.json(updatedContact)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
