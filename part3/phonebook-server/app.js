require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Persons = require('./models/person');

const PORT = process.env.PORT;
const app = express();

// server config
app.use(cors());
app.use(express.static('build'))
app.use(bodyParser.json());

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

/*
let phonebookData = [
    {
        "name": "Hermione Granger",
        "number": "39-07592385",
        "id": 1
    },
    {
        "name": "Ron Wisley",
        "number": "89-34589236",
        "id": 2
    },
    {
        "name": "Harry Potter",
        "number": "2803940239",
        "id": 3
    },
    {
        "name": "Severus Snape",
        "number": "81-81095392",
        "id": 4
    }
];
*/

const generateId = () => {
    const maxId = phonebookData.length > 0 ? Math.max(...phonebookData.map(n => n.id)) : 0;
    return maxId + 1;
}

app.get('/api/persons', (req, res) => {
    //res.send(phonebookData);
    Persons
        .find({})
        .then(results => {
            res.send(results);
        })
    
});

app.get('/api/persons/:id', (req, res) => {
    
    const id = Number(req.params.id);
    let phonebookIds = [];

    // fetch single phonebook entry based on id
    phonebookData.map(contact => {
        phonebookIds.push(contact.id);

        if (contact.id === id) {
            res.send(contact);
        }
    });

    // if id is not found, respond with appropriate status code
    if (!phonebookIds.includes(id)) {
        res.status(404).end();
    }
});


app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    phonebookData = phonebookData.filter(contact => contact.id !== id);
    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    
    const body = req.body;

    // error handling: request is missing name or number
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'contact data missing.',
        });
    }

    const contact = new Persons({
        name: body.name,
        number: body.number,
    });

    contact
        .save()
        .then(savedContact => {
            res.json(savedContact);
        });
});

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${phonebookData.length} people <br><br> ${new Date()}`);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
