'use strict';

/**
 * Module dependencies.
 */

var should = require('should');
var uuid = require('node-uuid');

var mesos = require('../lib');

var helper = require('./helper');

/**
 * Tests
 */

describe('Marathon', function() {
  before(function() {
    this.id = 'test-' + uuid.v4();
  });

  beforeEach(function() {
    this.marathon = mesos.Marathon({
      host: process.env.VM_HOST || '10.141.141.10',
    });
    this.marathon.on('debug', helper.debug('mesos:marathon'));
  });

  it('should create app', function(done) {
    var options = {
      id: this.id,
      cmd: 'sleep 300',
      cpus: 1,
      mem: 16,
      instances: 1,
    };

    this.marathon.apps.create(options, function(err) {
      should.not.exist(err);

      done();
    });
  });

  it('should return running apps', function(done) {
    this.marathon.apps.list(function(err, data) {
      should.not.exist(err);

      should(data).be.instanceof(Array);
      data.length.should.be.above(0);

      done();
    });
  });

  it('should return running apps filtered by cmd', function(done) {
    this.marathon.apps.list({ cmd: 'sleep' }, function(err, data) {
      should.not.exist(err);

      should(data).be.instanceof(Array);
      data.length.should.be.above(0);

      done();
    });
  });

  it('should not return running apps filtered by cmd', function(done) {
    this.marathon.apps.list({ cmd: 'notfound' }, function(err, data) {
      should.not.exist(err);

      should(data).be.instanceof(Array);
      data.length.should.equal(0);

      done();
    });
  });

  it('should return running app', function(done) {
    var self = this;

    self.marathon.apps.get(self.id, function(err, data) {
      should.not.exist(err);

      should.exist(data);

      data.should.have.properties('id', 'cmd');

      data.id.should.eql(self.id);

      done();
    });
  });

  it('should destroy app', function(done) {
    var self = this;

    self.marathon.apps.destroy(self.id, function(err) {
      should.not.exist(err);

      done();
    });
  });
});
