const {Schema, model} = require('mongoose');

const schema = new Schema({
  code: { type: String, unique: true },
  name: String,
  startDate: { type: Date, default: new Date() },
  description: String,
  //employees: [String],
  estimate: {
    managers: Number,
    leads: Number,
    devs: Number,
    testers: Number
  }
})

module.exports = model('projects', schema);