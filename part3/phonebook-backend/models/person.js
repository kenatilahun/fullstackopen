const mongoose = require('mongoose')
const config = require('../utils/config')
const logger = require('../utils/logger')

mongoose.set('strictQuery', false)
mongoose.set('bufferCommands', false)

if (config.MONGODB_URI) {
  mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
      logger.info('connected to MongoDB')
    })
    .catch((error) => {
      logger.error('error connecting to MongoDB:', error.message)
    })
}

const phoneValidator = {
  validator: (value) => /^\d{2,3}-\d{5,}$/.test(value),
  message:
    'Phone number must be in format XX-XXXXX... or XXX-XXXXX... with at least 5 digits after hyphen',
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be at least 3 characters long'],
    required: [true, 'Name is required'],
    unique: true,
  },
  number: {
    type: String,
    required: [true, 'Number is required'],
    validate: phoneValidator,
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
