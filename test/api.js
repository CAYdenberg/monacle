/* eslint-env mocha */

var request = require('supertest');
var app = require('../App')(true);
var check = require('check-types').assert;

describe('Pubmed API', function() {
  this.timeout(10000);

  it('should perform a search', function(done) {
    request(app)
      .get('/api/pubmed/ydenberg+ca')
      .expect('Content-Type', /json/)
      .expect('Access-Control-Allow-Origin', '*')
      .expect(200)
      .expect(function(res) {
        check.number(res.body.count, "Count property is not valid");
        check.array(res.body.papers);
      })
      .end(done);
  });

  it('should return an empty set with a count of zero if the query did not find any results', function(done) {
    request(app)
      .get('/api/pubmed/boioioioioioioioioing')
      .expect(200)
      .expect(function(res) {
        check.zero(res.body.count);
        check.emptyArray(res.body.papers);
      })
      .end(done);
  });

  it('should retrieve a pubmed summary', function(done) {
    request(app)
      .get('/api/pubmed/summary/19188495/')
      .expect(200)
      .expect(function(res) {
        check.object(res.body);
      })
      .end(done);
  });

  it('should retrieve an abstract (as a string)', function(done) {
    request(app)
      .get('/api/pubmed/abstract/19188495/')
      .expect(200)
      .expect(function(res) {
        check.string(res.body);
      })
      .end(done);
  });

  it('should retrieve an array of summaries that this paper cites', function(done) {
    request(app)
      .get('/api/pubmed/cites/19188495/')
      .expect(200)
      .expect(function(res) {
        check.array(res.body);
        check.object(res.body[0]);
      })
      .end(done);
  });

  it('should retrieve an array of summaries that cite this one', function(done) {
    request(app)
      .get('/api/pubmed/citedby/19188495/')
      .expect(200)
      .expect(function(res) {
        check.array(res.body);
        check.object(res.body[0]);
      })
      .end(done);
  });

  it('should retrieve an array of summaries similar to this paper', function(done) {
    request(app)
      .get('/api/pubmed/similar/19188495/')
      .expect(200)
      .expect(function(res) {
        check.array(res.body);
        check.object(res.body[0]);
      })
      .end(done);
  });

});
