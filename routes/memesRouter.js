const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Meme} = require('../models');

router.get('/', (req, res) => {
    Meme
      .find()
      .then(memes => {
        res.json(memes.map(meme => meme));
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });
  
  router.get('/:id', (req, res) => {
    Meme
      .findById(req.params.id)
      .then(meme => res.json(meme))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went horribly awry' });
      });
  });
  
  router.post('/', (req, res) => {
    const requiredFields = ['photoURL', 'text'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
  
    Meme
      .create({
        "photoURL" : req.body.photoURL,
        text: req.body.text
      })
      .then(memes => res.status(201).json(memes))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
      });
  
  });
  
  
  router.delete('/:id', (req, res) => {
    Meme
      .findByIdAndRemove(req.params.id)
      .then(() => {
        res.status(204).json({ message: 'success' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });
  
  
  router.put('/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
      res.status(400).json({
        error: 'Request path id and request body id values must match'
      });
    }
  
    const updated = {};
    const updateableFields = ['likes'];
    updateableFields.forEach(field => {
      if (field in req.body) {
        updated[field] = req.body[field];
      }
    });
  
    Meme
      .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
      .then(updatedMeme => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Something went wrong' }));
  });
  
  
  router.delete('/:id', (req, res) => {
    Meme
      .findByIdAndRemove(req.params.id)
      .then(() => {
        console.log(`Deleted meme with id \`${req.params.id}\``);
        res.status(204).end();
      });
  });

module.exports = router;