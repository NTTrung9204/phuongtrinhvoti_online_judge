const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const Contest = new Schema({
  problems: { type: Array, default: []},
  time: { type: String, default: Date().toString() },
  deleteAt: { type: String, default: "" },
  deleted: { type: String, default: "0" },
  participants: { type: Array, default: [] },
  duration: String,
  timeStart: String,
  timeTotal: String,
  PercentTime: String,
  CurrentTime: {type: Number, default: 0},
  AmountAttendee: {type: Number, default: 0},
  status: Number,
  name: String,
  date: String,
  ListSolutions: { type: Array, default: [] },
  ListBanned: { type: Array, default: [] },
  password: {type: String, default: ''}
});

module.exports = mongoose.model('Contest', Contest,'contest');