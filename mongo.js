const mongoose = require('mongoose');

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log(
    'please provide proper arguments! eg. node mongo.js {yourpassword} {name} {number}'
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://dannym112:${password}@cluster0.vfdrd8t.mongodb.net/personApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const name = process.argv[3];
const number = process.argv[4];

const person = new Person({
  name: name,
  number: number,
});

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook:');
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else {
  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
