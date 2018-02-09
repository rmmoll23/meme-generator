const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const uuid = require('uuid/v1');

// const {Photo} = require('../models');
const connect = require('../connect');

router.get('/', (req, res) => {
      connect()
      .then(db => {
        return db.collection('photos').find().toArray()
      })
      .then(photos => {
        res.json(photos);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });

router.get('/top', (req, res) => {
      connect()
      .then(db => {
        return db.collection('photos').find().sort({liked: 1}).toArray()
      })
      .then(photos => {
        res.json(photos);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });

router.get('/recent', (req, res) => {
      connect()
      .then(db => {
        return db.collection('photos').find().sort({date: -1}).toArray()
      })
      .then(photos => {
        res.json(photos);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
    });
  
  router.get('/:id', (req, res) => {
      connect()
      .then(db => {
        console.log(req.params.id);
        return db.collection('photos').findOne({id: req.params.id})
      })
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
  
      connect()
      .then(db => {
        db.collection('photos').insert({
          photoURL: req.body.photoURL, 
          date: new Date().toString(),
          liked: 0,
          id: uuid()
        })
      })
      .then(photos => res.status(201).json(photos))
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
      });
  
  });
  
  
  router.delete('/:id', (req, res) => {
    connect()
      .then(db => {
        db.collection('photos').findByIdAndRemove(req.params.id)
      })
      .then(() => {
        res.status(204).json({ message: 'success' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'something went terribly wrong' });
      });
  });
  
  
  router.put('/:id', (req, res) => {
    const requiredFields = ['liked', 'id'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    if (req.params.id !== req.body.id) {
      const message = (
        `Request path id (${req.params.id}) and request body id `
        `(${req.body.id}) must match`);
      console.error(message);
      return res.status(400).send(message);
    }
  
    connect()
      .then(db => {
        db.collection('photos').findOneAndUpdate({'id': req.params.id}, { $set: {'liked': req.body.liked} }, { returnNewDocument: true })
      })
      .then(updatedPhoto => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Something went wrong' }));
  });

module.exports = router;