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
      self.chronos.job.list(function(err, data) {
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

      self.chronos.job.create(options, cb);
    };

    async.auto(jobs, done);
  });

  afterEach(function(done) {
    var self = this;

    self.chronos.job.list(function(err, data) {
      var names = data.map(function(job) {
        return job.name;
      }).filter(function(name) {
        return name.match(/^test-.*/);
      });

      async.map(names, self.chronos.job.destroy.bind(self.chronos.job), done);
    });
  });

  it('should return jobs', function(done) {
    var self = this;

    self.chronos.job.list(function(err, data) {
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

    this.chronos.job.create(options, function(err) {
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
      self.chronos.job.destroy(self.name, cb);
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

  it('should start job', function(done) {
    var self = this;

    self.chronos.job.start(self.name, function(err) {
      should.not.exist(err);

      done();
    });
  });

  it('should return job stats', function(done) {
    var self = this;

    self.chronos.job.stats(self.name, function(err, data) {
      should.not.exist(err);

      should.exist(data);

      data.should.have.keys(
        '75thPercentile',
        '95thPercentile',
        '98thPercentile',
        '99thPercentile',
        'median',
        'mean',
        'count'
      );

      done();
    });
  });

  it('should return stat for all jobs', function(done) {
    var self = this;

    var opts = {
      percentile: 'mean',
    };

    self.chronos.job.stats(opts, function(err, data) {
      should.not.exist(err);

      should.exist(data);

      var count = 0;

      data.forEach(function(job) {
        job.should.have.keys(
          'jobNameLabel',
          'time'
        );

        if (job.jobNameLabel === self.name) count++;
      });

      count.should.be.above(0);

      done();
    });
  });

  it('should return jobs with search restrictions', function(done) {
    var self = this;

    self.chronos.job.search(self.name, function(err, data) {
      should.not.exist(err);

      should(data).be.instanceof(Array);

      data.length.should.equal(1);

      data[0].name.should.eql(self.name);
      data[0].owner.should.eql(self.owner);
      data[0].disabled.should.eql(false);

      done();
    });
  });

  it('should update task', function(done) {
    var self = this;

    var opts = {
      id: '123',
      statusCode: 0,
    };

    self.chronos.task.update(opts, function(err) {
      should.not.exist(err);

      done();
    });
  });

  it('should kill task', function(done) {
    var self = this;

    var opts = { job: self.name };

    self.chronos.task.kill(opts, function(err) {
      should.not.exist(err);

      done();
    });
  });
});
