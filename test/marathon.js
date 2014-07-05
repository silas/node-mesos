'use strict';

/**
 * Module dependencies.
 */

var async = require('async');
var should = require('should');
var uuid = require('node-uuid');

var mesos = require('../lib');

var helper = require('./helper');

/**
 * Tests
 */

describe('Marathon', function() {
  before(function(done) {
    var self = this;

    self.marathon = mesos.Marathon({
      host: process.env.VM_HOST || '10.141.141.10',
    });
    self.marathon.on('debug', helper.debug('mesos:marathon'));

    self.id = 'test-' + uuid.v4();

    var options = {
      id: self.id,
      cmd: 'sleep 300',
      cpus: 1,
      mem: 16,
      instances: 1,
    };

    self.marathon.apps.create(options, function(err) {
      should.not.exist(err);

      done();
    });
  });

  after(function(done) {
    var self = this;

    var jobs = {};

    jobs.list = self.marathon.apps.list.bind(self);

    jobs.destroy = ['list', function(cb, results) {
      var ids = results.list.map(function(app) {
        return app.id;
      }).filter(function(id) {
        return id.match(/^test-/);
      });

      if (!ids.length) return cb();

      async.map(ids, self.marathon.apps.destroy.bind(self), cb);
    }];

    async.auto(jobs, done);
  });

  it('should create app', function(done) {
    var self = this;

    var id = 'test-' + uuid.v4();

    var jobs = [];

    jobs.push(function(cb) {
      var options = {
        id: id,
        cmd: 'sleep 300',
        cpus: 1,
        mem: 16,
        instances: 1,
      };

      self.marathon.apps.create(options, function(err) {
        should.not.exist(err);

        cb();
      });
    });

    jobs.push(function(cb) {
      self.marathon.apps.get(id, function(err, data) {
        should.not.exist(err);

        should.exist(data);
        data.id.should.eql(id);

        cb();
      });
    });

    async.series(jobs, done);
  });

  it('should return running apps', function(done) {
    var self = this;

    self.marathon.apps.list(function(err, data) {
      should.not.exist(err);

      should(data).be.instanceof(Array);
      data.length.should.be.above(0);

      data.map(function(app) {
        return app.id;
      }).should.containEql(self.id);

      done();
    });
  });

  it('should return running apps filtered by cmd', function(done) {
    var self = this;

    this.marathon.apps.list({ cmd: 'sleep' }, function(err, data) {
      should.not.exist(err);

      should(data).be.instanceof(Array);
      data.length.should.be.above(0);

      data.map(function(app) {
        return app.id;
      }).should.containEql(self.id);

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

  it('should update app', function(done) {
    var self = this;

    var jobs = [];

    var options = {
      id: self.id,
      cmd: 'sleep 60',
      cpus: 2,
      instances: 2,
    };

    jobs.push(function(cb) {
      self.marathon.apps.update(options, function(err) {
        should.not.exist(err);

        cb();
      });
    });

    jobs.push(function(cb) {
      self.marathon.apps.get(self.id, function(err, data) {
        should.not.exist(err);

        should.exist(data);

        var keys = Object.keys(options);

        should(data).have.properties(keys);

        keys.forEach(function(key) {
          data[key].should.eql(options[key]);
        });

        cb();
      });
    });

    async.series(jobs, done);
  });

  it('should destroy app', function(done) {
    var self = this;

    var id = 'test-' + uuid.v4();

    var jobs = [];

    jobs.push(function(cb) {
      var options = {
        id: id,
        cmd: 'sleep 300',
        cpus: 1,
        mem: 16,
        instances: 1,
      };

      self.marathon.apps.create(options, cb);
    });

    jobs.push(function(cb) {
      self.marathon.apps.get(id, cb);
    });

    jobs.push(function(cb) {
      self.marathon.apps.destroy(id, function(err) {
        should.not.exist(err);

        cb();
      });
    });

    jobs.push(function(cb) {
      self.marathon.apps.get(id, function(err) {
        should.exist(err);
        err.message.should.eql('Not Found');

        cb();
      });
    });

    async.series(jobs, done);
  });
});
