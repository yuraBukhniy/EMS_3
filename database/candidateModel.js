const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: String,
  phone: String,
  seniority: String,
  position: { type: String },
  project: {type: Types.ObjectId, ref: 'projects'},
  interviewDate: { type: Date, default: new Date(Date.now()) },
  interviewer: String,
  status: { type: String, default: 'В очікуванні'},
});

module.exports = model('candidates', schema);