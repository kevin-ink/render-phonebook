const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("usage: node mongo.js <password> [<name> <number>]");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

if ((name && !number) || (!name && number)) {
  console.log("usage: node mongo.js <password> [<name> <number>]");
  process.exit(1);
}

const url = `mongodb+srv://fullstack:${password}@cluster0.0t0jvo8.mongodb.net/phonebookApp?appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+$/.test(v);
      },
    },
    required: true,
    minlength: 8,
  },
});

const Person = mongoose.model("Person", personSchema);

if (name && number) {
  const person = new Person({
    name: name,
    number: number,
  });
  person.save().then((res) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((persons) => {
    persons.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
}
