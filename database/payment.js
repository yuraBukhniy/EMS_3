const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
  date: Date,
  employee: {type: Types.ObjectId, ref: 'users'},
  salary: Number,
  singleTax: Number,
  contribTax: Number,
  sum: Number,
  deduction: Number
});

module.exports = model('payments', schema);