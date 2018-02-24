'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

const {BlogPost} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

describe('GET endpoint', function() {

    it('should return all top Memes', function() {
     
      let res;
      return chai.request(app)
        .get('/memes/top')
        .then(function(_res) {
          // so subsequent .then blocks can access response object
          res = _res;
          expect(res).to.have.status(200);
          // otherwise our db seeding didn't work
          console.log(res.body);
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length.of.at.least(1);
          return BlogPost.count();
        })
        .then(function(count) {
          
          expect(res.body.length).to.equal(count);
        });
    });


    it('should return BlogPosts with right fields', function() {

      let resBlogPost;
      return chai.request(app)
        .get('/posts')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length.of.at.least(1);

          res.body.forEach(function(post) {
            expect(post).to.be.a('object');
            expect(post).to.include.keys(
              'id', 'title', 'content', 'author', 'created');
          });
          resBlogPost = res.body[0];
          return BlogPost.findById(resBlogPost.id);
        })
        .then(function(blogPost) {

          expect(resBlogPost.title).to.equal(blogPost.title);
          expect(resBlogPost.content).to.equal(blogPost.content);
          expect(resBlogPost.author).to.equal(blogPost.authorName);
        });
    });
  });

  describe('POST endpoint', function() {

    it('should add a new BlogPost', function() {

      const newBlogPost = generateBlogPostData();

      return chai.request(app)
        .post('/posts')
        .send(newBlogPost)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'id', 'title', 'content', 'author', 'created');
          expect(res.body.title).to.equal(newBlogPost.title);
          // cause Mongo should have created id on insertion
          expect(res.body.id).to.not.be.null;
          expect(res.body.content).to.equal(newBlogPost.content);
          expect(res.body.author).to.equal(`${newBlogPost.author.firstName} ${newBlogPost.author.lastName}`);

          return BlogPost.findById(res.body.id);
        })
        .then(function(BlogPost) {
          expect(BlogPost.title).to.equal(newBlogPost.title);
          expect(BlogPost.content).to.equal(newBlogPost.content);
          expect(BlogPost.author.firstName).to.equal(newBlogPost.author.firstName);
          expect(BlogPost.author.lastName).to.equal(newBlogPost.author.lastName);
        });
    });
  });

  describe('PUT endpoint', function() {

    it('should update fields you send over', function() {
      const updateData = {
        title: 'fofofofofofofof',
        content: 'futuristic fusion',
        author: {firstName: 'bizz', lastName: 'bang'}
      };

      return BlogPost
        .findOne()
        .then(function(blogPost) {
          updateData.id = blogPost.id;

          // make request then inspect it to make sure it reflects
          // data we sent
          return chai.request(app)
            .put(`/posts/${blogPost.id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(204);

          return BlogPost.findById(updateData.id);
        })
        .then(function(blogPost) {
          expect(blogPost.title).to.equal(updateData.title);
          expect(blogPost.content).to.equal(updateData.content);
          expect(blogPost.author.firstName).to.equal(updateData.author.firstName);
          expect(blogPost.author.lastName).to.equal(updateData.author.lastName);
        });
    });
  });

  describe('DELETE endpoint', function() {
   
    it('delete a restaurant by id', function() {

      let blogPost;

      return BlogPost
        .findOne()
        .then(function(_blogPost) {
          blogPost = _blogPost;
          return chai.request(app).delete(`/posts/${blogPost.id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return BlogPost.findById(blogPost.id);
        })
        .then(function(_blogPost) {
          expect(_blogPost).to.be.null;
        });
    });
  });
});