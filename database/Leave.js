const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
  description: String,
  author: {type: Types.ObjectId, ref: 'users'},
  type: String,
  startDate: {type: Date},
  endDate: {type: Date},
  days: Number,
  status: {type: String, default: 'Очікує підтвердження'},
});

module.exports = model('leaves', schema);