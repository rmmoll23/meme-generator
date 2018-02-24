'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {Photo} = require('../models');
const {app, runServer, closeServer} = require('../app');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedPhotoData() {
  console.info('seeding Photo data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generatePhotoData());
  }
  // this will return a promise
  return Photo.insertMany(seedData);
}

function generatePhotoData() {
  return {
    photoURL: faker.lorem.url(),
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

describe('Photos API resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedPhotoData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });


describe('GET endpoint', function() {

    it('should return all Photos', function() {
     
      let res;
      return chai.request(app)
        .get('photos')
        .then(function(_res) {
          // so subsequent .then blocks can access response object
          res = _res;
          expect(res).to.have.status(200);
          // otherwise our db seeding didn't work
          console.log(res.body);
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length.of.at.least(1);
          return Photos.count();
        })
        .then(function(count) {
          
          expect(res.body.length).to.equal(count);
        });
    });


    it('should return photos with right fields', function() {

      let resPhoto;
      return chai.request(app)
        .get('photos')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length.of.at.least(1);

          res.body.forEach(function(photo) {
            expect(photo).to.be.a('object');
            expect(photo).to.include.keys(
              'id', 'photoURL', 'liked', 'date');
          });
          resPhoto = res.body[0];
          return Photo.findById(resPhoto.id);
        })
        .then(function(Photo) {

          expect(resPhoto.photoURL).to.equal(photo.photoURL);
          expect(resPhoto.liked).to.equal(photo.liked);
          expect(resPhoto.date).to.equal(photo.date);
        });
    });
  });

  describe('POST endpoint', function() {

    it('should add a new Photo', function() {

      const newPhoto = generatePhotoData();

      return chai.request(app)
        .post('photos')
        .send(newPhoto)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'id', 'photoURL', 'liked', 'date');
          expect(res.body.photoURL).to.equal(newPhoto.photoURL);
          // cause Mongo should have created id on insertion
          expect(res.body.id).to.not.be.null;
          expect(res.body.liked).to.equal(newPhoto.liked);
          expect(res.body.date).to.equal(newPhoto.date);

          return Photo.findById(res.body.id);
        })
        .then(function(Photo) {
          expect(Photo.photoURL).to.equal(newPhoto.photoURL);
          expect(Photo.liked).to.equal(newPhoto.liked);
          expect(Photo.date).to.equal(newPhoto.date);
        });
    });
  });

  describe('PUT endpoint', function() {

    it('should update fields you send over', function() {
      const updateData = {
        liked: 2,
      };

      return Photo
        .findOne()
        .then(function(photo) {
          updateData.id = photo.id;

          // make request then inspect it to make sure it reflects
          // data we sent
          return chai.request(app)
            .put(`/photos/${photo.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return Photo.findById(updateData.id);
        })
        .then(function(photo) {
          expect(photo.liked).to.equal(updateData.liked);
        });
    });
  });

  describe('DELETE endpoint', function() {
   
    it('delete a photo by id', function() {

      let photo;

      return Photo
        .findOne()
        .then(function(_photo) {
          photo = _photo;
          return chai.request(app).delete(`/photos/${photo.id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return Photo.findById(photo.id);
        })
        .then(function(_photo) {
          expect(_photo).to.be.null;
        });
    });
  });
});