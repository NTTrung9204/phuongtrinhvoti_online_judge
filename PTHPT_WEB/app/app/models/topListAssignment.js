const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const topListAssignment = new Schema({
  nameType: String,
  Type: String,
  time: { type: String, default: Date().toString() },
});

module.exports = mongoose.model('topListAssignment', topListAssignment,'topListAssignment');