'use strict';

/**
 * Module dependencies.
 */

var async = require('async');
var lodash = require('lodash');
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

  beforeEach(function(done) {
    var self = this;

    self.name = 'test-' + uuid.v4();
    self.owner = 'owner@example.org';

    var jobs = {};

    jobs.create = function(cb) {
      var options = {
        schedule: 'R10/2012-10-01T05:52:00Z/PT2S',
        name: self.name,
        epsilon: 'PT15M',
        command: 'true',
        owner: self.owner,
        async: false,
      };

      self.chronos.create(options, cb);
    };

    async.auto(jobs, done);
  });

  it('should return jobs', function(done) {
    var self = this;

    this.chronos.list(function(err, data) {
      should.not.exist(err);

      should(data).be.instanceof(Array);

      var job = lodash.find(data, function(job) {
        return self.name === job.name;
      });

      should.exist(job);

      job.name.should.eql(self.name);
      job.owner.should.eql(self.owner);
      job.disabled.should.eql(false);

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
