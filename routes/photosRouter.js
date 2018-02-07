const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Photo} = require('../models');

router.get('/', (req, res) => {
    Photo
      .find()
      .then(photos => {
        res.json(photos.map(photo => photo));
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });
  
  router.get('/:id', (req, res) => {
    Photo
      .findById(req.params.id)
      .then(photo => res.json(photo))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went horribly awry' });
      });
  });
  
  router.post('/', (req, res) => {
    const requiredFields = ['photoURL'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
  
    Photo
      .create({
        photoURL : req.body.photoURL
      })
      .then(photos => res.status(201).json(photos))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
      });
  
  });
  
  
  router.delete('/:id', (req, res) => {
    Photo
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
  
    Photo
      .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
      .then(updatedPhoto => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Something went wrong' }));
  });
  
  
  router.delete('/:id', (req, res) => {
    Photo
      .findByIdAndRemove(req.params.id)
      .then(() => {
        console.log(`Deleted photo with id \`${req.params.id}\``);
        res.status(204).end();
      });
  });

module.exports = router;