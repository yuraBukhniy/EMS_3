const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
  title: String,
  description: String,
  author: String,
  startDate: {type: Date, default: new Date(Date.now()) - 12*3600*1000},
  project: {type: Types.ObjectId, ref: 'projects'},
  assignedTo: [String],
  status: {type: String, default: 'У черзі'},
  deadline: Date,
  endDate: Date,
  overtime: Array
});

module.exports = model('tasks', schema);