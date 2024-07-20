const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const Coreteam = new Schema({
    time: { type: String, default: Date().toString() },
    name: String,
    location : String,
    role: String,
    mail: String,
    imageFrist: String,
    imageSecond: String,
    idUser: String,
});

module.exports = mongoose.model('Coreteam', Coreteam,'coreteam');