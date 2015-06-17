var fs = require('fs');
var path = require('path');
var assert = require('chai').assert;
var request = require('request');
var app = require('./app');

describe('partials', function() {

  before(function(done) {
    server = app.listen(3000, function() {
      done();
    });
  });

  beforeEach(function(done) {
    fs.readFile(path.resolve(__dirname, 'views/partials/header.hbs'), function(err, data) {
      if (err) return done(err);

      content = data;
      done();
    });
  });

  it('can register Handlebars partials', function(done) {
    request('http://localhost:3000/', function(err, res, body) {
      assert.include(body, 'Header');
      assert.include(body, 'Footer');
      done();
    });
  });

  it('can register again on partials change', function(done) {
    request('http://localhost:3000/', function(err, res, body) {
      fs.writeFile(path.resolve(__dirname, 'views/partials/header.hbs'), 'Changed', function(err) {
        if (err) return done(err);

        request('http://localhost:3000/', function(err, res, body) {
          assert.include(body, 'Changed');
          assert.include(body, 'Footer');
          done();
        });
      })
    });
  });

  it('restored from partials change', function(done) {
    request('http://localhost:3000/', function(err, res, body) {
      assert.include(body, 'Header');
      assert.include(body, 'Footer');
      done();
    });
  });

  afterEach(function(done) {
    fs.writeFile(path.resolve(__dirname, 'views/partials/header.hbs'), content, function(err) {
      if (err) return done(err);

      done();
    });
  });

  after(function(done) {
    server.close(function() {
      done();
    });
  });

});
