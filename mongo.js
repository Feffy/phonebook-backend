const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide password as argument: node mongo.js <password>');
  process.exit(1);
}

if (process.argv.length === 4) {
  console.log(
    'Please provide a phone number as argument: node mongo.js <password> <name> <phone number>'
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.drl3r.mongodb.net/phonebook?retryWrites=true&w=majority`;
const personSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
});
const Person = mongoose.model('Person', personSchema);

const main = async () => {
  await mongoose.connect(url);

  if (process.argv.length === 3) getPersons();
  if (process.argv.length === 5) addPerson();
};

const addPerson = async () => {
  const name = process.argv[3];
  const phoneNumber = process.argv[4];

  const person = new Person({
    name,
    phoneNumber,
  });

  const savedPerson = await person.save();
  console.log('person saved:', savedPerson);
  mongoose.connection.close();
};

const getPersons = async () => {
  const persons = await Person.find({});
  console.log('phonebook:');
  persons.forEach((person) =>
    console.log(`${person.name} ${person.phoneNumber}`)
  );
  mongoose.connection.close();
};

main();const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide password as argument: node mongo.js <password>');
  process.exit(1);
}

if (process.argv.length === 4) {
  console.log(
    'Please provide a phone number as argument: node mongo.js <password> <name> <phone number>'
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.drl3r.mongodb.net/phonebook?retryWrites=true&w=majority`;
const personSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
});
const Person = mongoose.model('Person', personSchema);

const main = async () => {
  await mongoose.connect(url);

  if (process.argv.length === 3) getPersons();
  if (process.argv.length === 5) addPerson();
};

const addPerson = async () => {
  const name = process.argv[3];
  const phoneNumber = process.argv[4];

  const person = new Person({
    name,
    phoneNumber,
  });

  const savedPerson = await person.save();
  console.log('person saved:', savedPerson);
  mongoose.connection.close();
};

const getPersons = async () => {
  const persons = await Person.find({});
  console.log('phonebook:');
  persons.forEach((person) =>
    console.log(`${person.name} ${person.phoneNumber}`)
  );
  mongoose.connection.close();
};

main();