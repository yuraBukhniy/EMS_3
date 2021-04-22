const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
  title: String,
  description: String,
  author: {type: Types.ObjectId, ref: 'users'},
  type: String,
  date: {type: Date, default: new Date(Date.now())},
  status: {type: String, default: 'У черзі'},
  reply: String
});

module.exports = model('service_requests', schema);