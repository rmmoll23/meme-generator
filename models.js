'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const photoSchema = mongoose.Schema({
  photoURL: {type: String, required: true},
  date: {type: Date, default: Date.now}
});

const Photos = mongoose.model('Photos', photoSchema);

const memeSchema = mongoose.Schema({
  photoURL: {type: String, required: true},
  text: {type: String, required: true},
  date: {type: Date, default: Date.now}
});


const Memes = mongoose.model('Memes', memeSchema);

module.exports = {Photos, Memes};