'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {Meme} = require('../models');
const {app, runServer, closeServer} = require('../app');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedMemeData() {
  console.info('seeding Meme data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateMemeData());
  }
  // this will return a promise
  return Meme.insertMany(seedData);
}

function generateMemeData() {
  return {
    memeURL: faker.lorem.url(),
    liked: faker.lorem.number(),
    date: faker.lorem.date()
  };
}

function tearDownDb() {
    return new Promise((resolve, reject) => {
      console.warn('Deleting database');
      mongoose.connection.dropDatabase()
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

describe('BlogPosts API resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedMemeData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });


describe('GET endpoint', function() {

    it('should return all Memes', function() {
     
      let res;
      return chai.request(app)
        .get('memes')
        .then(function(_res) {
          // so subsequent .then blocks can access response object
          res = _res;
          expect(res).to.have.status(200);
          // otherwise our db seeding didn't work
          console.log(res.body);
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length.of.at.least(1);
          return Meme.count();
        })
        .then(function(count) {
          
          expect(res.body.length).to.equal(count);
        });
    });


    it('should return memes with right fields', function() {

      let resMeme;
      return chai.request(app)
        .get('memes')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length.of.at.least(1);

          res.body.forEach(function(meme) {
            expect(meme).to.be.a('object');
            expect(meme).to.include.keys(
              'id', 'memeURL', 'liked', 'date');
          });
          resMeme = res.body[0];
          return Meme.findById(resMeme.id);
        })
        .then(function(Meme) {

          expect(resMeme.memeURL).to.equal(meme.memeURL);
          expect(resMeme.liked).to.equal(meme.liked);
          expect(resMeme.date).to.equal(meme.date);
        });
    });
  });

  describe('POST endpoint', function() {

    it('should add a new Meme', function() {

      const newMeme = generateMemeData();

      return chai.request(app)
        .post('memes')
        .send(newMeme)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'id', 'memeURL', 'liked', 'date');
          expect(res.body.memeURL).to.equal(newMeme.memeURL);
          // cause Mongo should have created id on insertion
          expect(res.body.id).to.not.be.null;
          expect(res.body.liked).to.equal(newMeme.liked);
          expect(res.body.date).to.equal(newMeme.date);

          return Meme.findById(res.body.id);
        })
        .then(function(Meme) {
          expect(Meme.memeURL).to.equal(newMeme.memeURL);
          expect(Meme.liked).to.equal(newMeme.liked);
          expect(Meme.date).to.equal(newMeme.date);
        });
    });
  });

  describe('PUT endpoint', function() {

    it('should update fields you send over', function() {
      const updateData = {
        liked: 2,
      };

      return Meme
        .findOne()
        .then(function(meme) {
          updateData.id = meme.id;

          // make request then inspect it to make sure it reflects
          // data we sent
          return chai.request(app)
            .put(`/memes/${meme.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return Meme.findById(updateData.id);
        })
        .then(function(meme) {
          expect(meme.liked).to.equal(updateData.liked);
        });
    });
  });

  describe('DELETE endpoint', function() {
   
    it('delete a Meme by id', function() {

      let meme;

      return Meme
        .findOne()
        .then(function(_meme) {
          meme = _meme;
          return chai.request(app).delete(`/memes/${meme.id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return Meme.findById(meme.id);
        })
        .then(function(_meme) {
          expect(_meme).to.be.null;
        });
    });
  });
});