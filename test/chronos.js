'use strict';

/**
 * Module dependencies.
 */

var should = require('should');

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
});
