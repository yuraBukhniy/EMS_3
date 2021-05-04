const {Schema, model} = require('mongoose');

const schema = new Schema({
  code: { type: String, unique: true },
  name: String,
  startDate: { type: Date, default: new Date() },
  description: String,
  budget: {type: Number, default: 0},
  estimate: Object
})

module.exports = model('projects', schema);