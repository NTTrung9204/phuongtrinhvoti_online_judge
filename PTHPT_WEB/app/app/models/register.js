const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const User = new Schema({
  username: String,
  password: String,
  email: String,
  role: String,
  position: {type: String, default: 'Gà con'},
  goldenMedal: {type: Array, default: []},
  silverMedal: {type: Array, default: []},
  bronzeMedal: {type: Array, default: []},
  contest: {type: Number, default: 0},
  assignment: {type: Number, default: 0},
  historySubmit: {type: Array, default: []},
  score: {type: Number, default: 0},
  follower: {type: Number, default: 0},
  whoFollow: {type: Array, default: []},
  deleted: {type: String, default: '0'},
  time: { type: String, default: Date().toString() },
  descriptionA: {type: String, default: ''},
  descriptionB: {type: String, default: ''},
  avatar: {type: String, default: ''},
  bio: {type: String, default: ''},
  career: {type: String, default: ''},
  imageDescription: {type: String, default: ''},
  messenger: {type: String, default: ''},
  discord: {type: String, default: ''},
  youtube: {type: String, default: ''},
  mail: {type: String, default: ''},
  github: {type: String, default: ''},
  color: {type: String, default: 'black'},
  fontWeight: {type: Number, default: 100},
  announcement: {type: Array, default: []},
  isNew: {type: Boolean, default: true}
});

module.exports = mongoose.model('User', User,'user');