'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('GET endpoint', function() {

    it('default', function() {

        expect(true).to.equal(true);
    })
});