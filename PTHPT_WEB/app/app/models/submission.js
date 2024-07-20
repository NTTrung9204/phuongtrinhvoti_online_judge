const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const Submission = new Schema({
    title: String,
    image: String,
    score: {type: Number, default: 0},
    time: { type: String, default: Date().toString() },
    applicant: String,
    date: String,
    key: String,
    type: String,
});

module.exports = mongoose.model('Submission', Submission,'submission');