const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const Person = require('./models/person');

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

app.get('/api/persons', (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(404).json({ error: 'needs name and number' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.get('/healthcheck', (req, res) => {
  res.send('2'); // change this string to ensure a new version deployed
});

app.get('/info', (req, res) => {
  Person.count({}).then((count) => {
    res.send(
      `<p>Phonebook has info for ${count} people</p>
       <p>${new Date()}</p>`
    );
  });
});

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person);
  });
  // const id = Number(req.params.id);
  // const person = persons.find((person) => person.id === id);

  // person ? res.json(person) : res.status(404).end();
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.use(errorHandler);

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
