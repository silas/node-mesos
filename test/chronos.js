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
    var self = this;

    self.chronos = mesos.Chronos({
      host: process.env.VM_HOST || '10.141.141.10',
    });
    self.chronos.on('debug', helper.debug('mesos:chronos'));

    self.exists = function(name, cb) {
      self.chronos.jobs.list(function(err, data) {
        if (err) return cb(err);

        var exists = data.some(function(job) {
          return job.name === name;
        });

        cb(null, exists);
      });
    };
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

      self.chronos.jobs.create(options, cb);
    };

    async.auto(jobs, done);
  });

  afterEach(function(done) {
    var self = this;

    self.chronos.jobs.list(function(err, data) {
      var names = data.map(function(job) {
        return job.name;
      }).filter(function(name) {
        return name.match(/^test-.*/);
      });

      async.map(names, self.chronos.jobs.destroy.bind(self.chronos.jobs), done);
    });
  });

  it('should return jobs', function(done) {
    var self = this;

    self.chronos.jobs.list(function(err, data) {
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

    this.chronos.jobs.create(options, function(err) {
      should.not.exist(err);

      done();
    });
  });

  it('should delete job', function(done) {
    var self = this;

    var jobs = {};

    jobs.before = function(cb) {
      self.exists(self.name, cb);
    };

    jobs.destroy = ['before', function(cb) {
      self.chronos.jobs.destroy(self.name, cb);
    }];

    jobs.after = ['destroy', function(cb) {
      self.exists(self.name, cb);
    }];

    async.auto(jobs, function(err, results) {
      if (err) return done(err);

      delete results.destroy;

      results.should.eql({
        before: true,
        after: false,
      });

      done();
    });
  });
});
