const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const Post = new Schema({
  title: String,
  description: String,
  image: String,
  time: { type: String, default: Date().toString() },
//   slug: { type: String, slug: "title", unique: true },
  deleteAt: { type: String, default: "" },
  deleted: { type: String, default: "0" },
  author: String,
  numberComment: {type: Number, default: 0},
  numberView: {type: Number, default: 0},
  comment: { type: Object, default: '' }
});

module.exports = mongoose.model('Post', Post,'post');