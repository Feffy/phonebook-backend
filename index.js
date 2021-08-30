require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('build'));

// morgan config
morgan.token('body', (request, response) => JSON.stringify(request.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

// routes

app.get('/api/persons', async (request, response, next) => {
  try {
    const persons = await Person.find({});
    response.json(persons);
  } catch (error) {
    next(error);
  }
});

app.get('/api/persons/:id', async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id);

    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

app.delete('/api/persons/:id', async (request, response, next) => {
  try {
    await Person.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.get('/api/info', async (request, response, next) => {
  try {
    const persons = await Person.find({});
    const responseText = `Phonebook has info for ${
      persons.length
    } people <br /> <br /> ${new Date()}`;
    response.send(responseText);
  } catch (error) {
    next(error);
  }
});

app.post('/api/persons', async (request, response, next) => {
  try {
    const body = request.body;
    const person = new Person({
      name: body.name,
      number: body.number,
    });

    const savedPerson = await person.save();
    response.json(savedPerson);
  } catch (error) {
    next(error);
  }
});

app.put('/api/persons/:id', async (request, response, next) => {
  try {
    const { name, number } = request.body;

    const person = {
      name,
      number,
    };

    const updatedPerson = await Person.findByIdAndUpdate(
      request.params.id,
      person,
      { new: true, runValidators: true, context: 'query' }
    );
    if (updatedPerson) {
      response.json(updatedPerson);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

// custom middleware

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    if (error.errors.name) {
      return response.status(400).send({ error: error.errors.name.message });
    }
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(unknownEndpoint);
app.use(errorHandler);

// launch app

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});