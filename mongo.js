const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}
/*
if (process.argv.length === 4 || process.argv.length > 5){
    console.log('wrong number of arguments')
    process.exit(1)
}*/

const password = process.argv[2]

const url =
    `mongodb+srv://gadhan:${password}@cluster0.wbnncub.mongodb.net/noteApp?retryWrites=true&w=majority`


mongoose.set('strictQuery', false)
mongoose.connect(url)

const phonebookNumberSchema = new mongoose.Schema({
  name: String,
  phonenumber: String,
})

const Phonenumber = mongoose.model('Phonenumber', phonebookNumberSchema)

if (process.argv.length === 3)
  Phonenumber.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(phonenumber => {
      console.log(`${phonenumber.name} ${phonenumber.phonenumber}`)
    })
    mongoose.connection.close()
  })

if (process.argv.length === 5){
  const number = new Phonenumber({
    name: process.argv[3],
    phonenumber: process.argv[4]
  })
  number.save().then(() => {
    console.log(`added ${number.name} number ${number.phonenumber} to phonebook`)
    mongoose.connection.close()
  })
}
