const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Photos} = require('./models');

router.get('/photos', (req, res) => {
    Photos
      .find()
      .then(photos => {
        res.json(photos.map(photo => photo.serialize()));
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });
  
  router.get('/photos/:id', (req, res) => {
    Photos
      .findById(req.params.id)
      .then(post => res.json(post.serialize()))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went horribly awry' });
      });
  });
  
  router.post('/photos', (req, res) => {
    const requiredFields = ['photo-url'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
  
    Photos
      .create({
        "photo-url" : req.body.photo-url
      })
      .then(photos => res.status(201).json(photos.serialize()))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
      });
  
  });
  
  
  router.delete('/photos/:id', (req, res) => {
    Photos
      .findByIdAndRemove(req.params.id)
      .then(() => {
        res.status(204).json({ message: 'success' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });
  
  
  router.put('/photos/:id', (req, res) => {
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
  
    Photos
      .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
      .then(updatedPhoto => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Something went wrong' }));
  });
  
  
  router.delete('/:id', (req, res) => {
    Photos
      .findByIdAndRemove(req.params.id)
      .then(() => {
        console.log(`Deleted photo with id \`${req.params.id}\``);
        res.status(204).end();
      });
  });

module.exports = router;