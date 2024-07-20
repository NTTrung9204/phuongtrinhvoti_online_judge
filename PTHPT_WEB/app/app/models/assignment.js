const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const Assignment = new Schema({
  title: String,
  description: String,
  image: String,
  score: {type: Number, default: 0},
  view: {type: Number, default: 0},
  time: { type: String, default: Date().toString() },
  deleteAt: { type: String, default: "" },
  deleted: { type: String, default: "0" },
  author: String,
  date: String,
  content: String,
  resource: String,
  type: String,
  likes: {type: Number, default: 0},
  numberComment: {type: Number, default: 0},
  numberReact: {type: Number, default: 0},
  comment: { type: Array, default: [] },
  solutions: { type: Array, default: [] }
});

module.exports = mongoose.model('Assignment', Assignment,'assignment');