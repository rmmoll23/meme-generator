'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const photoSchema = mongoose.Schema({
  "photo-url": {type: String, required: true},
  date: {type: Date, default: Date.now}
});

const Photo = mongoose.model('Photo', photoSchema);

const memeSchema = mongoose.Schema({
  "photo-url": {type: String, required: true},
  text: {type: String, required: true},
  date: {type: Date, default: Date.now}
});


const Meme = mongoose.model('Meme', memeSchema);

module.exports = {Photo, Meme};