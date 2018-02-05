const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Memes} = require('./models');

router.get('/memes', (req, res) => {
    Memes
      .find()
      .then(memes => {
        res.json(memes.map(meme => meme.serialize()));
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });
  
  router.get('/memes/:id', (req, res) => {
    Memes
      .findById(req.params.id)
      .then(post => res.json(post.serialize()))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went horribly awry' });
      });
  });
  
  router.post('/memes', (req, res) => {
    const requiredFields = ['photo-url', 'text'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
  
    Memes
      .create({
        "photo-url" : req.body.photo-url,
        text: req.body.text
      })
      .then(memes => res.status(201).json(memes.serialize()))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
      });
  
  });
  
  
  router.delete('/memes/:id', (req, res) => {
    Memes
      .findByIdAndRemove(req.params.id)
      .then(() => {
        res.status(204).json({ message: 'success' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });
  
  
  router.put('/memes/:id', (req, res) => {
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
  
    Memes
      .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
      .then(updatedMeme => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Something went wrong' }));
  });
  
  
  router.delete('/:id', (req, res) => {
    Memes
      .findByIdAndRemove(req.params.id)
      .then(() => {
        console.log(`Deleted photo with id \`${req.params.id}\``);
        res.status(204).end();
      });
  });

module.exports = router;