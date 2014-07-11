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

describe('Chronos', function() {
  before(function() {
    this.chronos = mesos.Chronos({
      host: process.env.VM_HOST || '10.141.141.10',
    });
    this.chronos.on('debug', helper.debug('mesos:chronos'));
  });

  it('should return jobs', function(done) {
    this.chronos.list(function(err, data) {
      should.not.exist(err);

      should(data).be.instanceof(Array);

      done();
    });
  });

  it('should create job', function(done) {
    var options = {
      schedule: 'R10/2012-10-01T05:52:00Z/PT2S',
      name: 'test-' + uuid.v4(),
      epsilon: 'PT15M',
      command: 'true',
      owner: 'owner@example.org',
      async: false,
    };

    this.chronos.create(options, function(err) {
      should.not.exist(err);

      done();
    });
  });
});
