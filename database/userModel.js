const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
  phone: String,
  seniority: String,
  position: { type: String },
  role: { type: String, default: 'employee' },
  registeredDate: { type: Date, default: new Date(Date.now()), required: true },
  supervisor: {type: String},
  team: [String],
  project: {type: Types.ObjectId, ref: 'projects'},
  salary: Number,
  leavesAvailable: {
    type: Object,
    default: {
      paid: 20,
      unpaid: 20,
      illness: 20
    }
  }
});

module.exports = model('users', schema);