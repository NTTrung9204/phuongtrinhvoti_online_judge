const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');


mongoose.plugin(slug);

const Announcement = new Schema({
  title: String,
  description: String,
  image: String,
  time: { type: String, default: Date().toString() },
  date: String,
  deleteAt: { type: String, default: "" },
  deleted: { type: String, default: "0" },
  author: String,
  likes: {type: Array, default: []},
  numberComment: {type: Number, default: 0},
  numberReact: {type: Number, default: 0},
  comment: { type: Array, default: [] },
  slug: { type: String, slug: "title", unique: true },
});

module.exports = mongoose.model('Announcement', Announcement,'announcement');