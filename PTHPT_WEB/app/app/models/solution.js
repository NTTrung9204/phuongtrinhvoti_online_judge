const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const Solution = new Schema({
  descriptionA: String,
  descriptionB: String,
  imageA: String,
  imageB: String,
  imageC: String,
  author: String,
  key: String,
  time: { type: String, default: Date().toString() },
  deleteAt: { type: String, default: "" },
  deleted: { type: String, default: "0" },
  likes: {type: Number, default: 0},
  numberComment: {type: Number, default: 0},
  numberReact: {type: Number, default: 0},
  comment: { type: Object, default: '' }
});

module.exports = mongoose.model('Solution', Solution,'solution');