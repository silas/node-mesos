'use strict';

/**
 * Module dependencies.
 */

var async = require('async');
var http = require('http');
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

    self.events = [];

    self.http = http.createServer(function(req, res) {
      var chunks = [];
      var bodyLength = 0;

      req.on('data', function(chunk) {
       chunks.push(chunk);
       bodyLength += chunk.length;
      });

      req.on('end', function() {
        var body = Buffer.concat(chunks, bodyLength).toString();

        self.events.push({
          path: req.url,
          body: body,
        });

        res.writeHead(200);
        res.end();
      });
    });

    var eventHost = process.env.EVENT_HOST || '10.141.141.1';
    var eventPort = process.env.EVENT_PORT || 8088;

    self.callbackUrl = 'http://' + eventHost + ':' + eventPort + '/callback';

    var jobs = {};

    jobs.httpListen = function(cb) {
      self.http.listen(eventPort, eventHost, cb);
    };

    jobs.clean = function(cb) {
      helper.cleanMarathon(self, cb);
    };

    jobs.app = ['clean', function(cb) {
      self.marathon.apps.create(options, function(err) {
        should.not.exist(err);

        cb();
      });
    }];

    async.auto(jobs, done);
  });

  after(function(done) {
    this.http.close();

    helper.cleanMarathon(this, done);
  });

  it('should handle event subscription', function(done) {
    var self = this;

    var id = 'test-' + uuid.v4();

    var jobs = [];

    jobs.push(function(cb) {
      self.marathon.eventSubscriptions.list(function(err, data) {
        should.not.exist(err);

        should(data).be.instanceof(Array);

        data.should.not.containEql(self.callbackUrl);

        cb();
      });
    });

    jobs.push(function(cb) {
      self.marathon.eventSubscriptions.register(self.callbackUrl, cb);
    });

    jobs.push(function(cb) {
      self.marathon.eventSubscriptions.list(function(err, data) {
        should.not.exist(err);

        should(data).be.instanceof(Array);

        data.should.containEql(self.callbackUrl);

        cb();
      });
    });

    jobs.push(function(cb) {
      var options = {
        id: id,
        cmd: 'sleep 123',
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
      async.retry(
        100,
        function(cb) {
          if (!self.events.length) {
            var err = new Error('No events found');
            return setTimeout(function() { cb(err); }, 100);
          }

          cb();
        },
        cb
      );
    });

    async.series(jobs, function(err) {
      should.not.exist(err);

      var events = self.events;

      events.should.not.eql([]);

      events = events.filter(function(res) {
        var data = res && res.body && JSON.parse(res.body);

        return data.eventType === 'api_post_event' && data.appDefinition &&
          data.appDefinition.id === id;
      });

      events.should.not.eql([]);

      done();
    });
  });

  it('should return all tasks', function(done) {
    var self = this;

    var jobs = [];

    jobs.push(function(cb) {
      helper.waitOnTask(self.marathon, self.id, cb);
    });

    jobs.push(function(cb) {
      self.marathon.tasks(function(err, data) {
        should.not.exist(err);

        should(data).be.instanceof(Array);

        var task = data.filter(function(task) {
          return task.appId === self.id;
        })[0];

        should.exist(task);

        task.should.have.properties('appId', 'id');

        task.appId.should.eql(self.id);

        cb();
      });
    });

    async.series(jobs, done);
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

  it('should return app versions', function(done) {
    this.marathon.apps.versions(this.id, function(err, data) {
      should.not.exist(err);

      should(data).be.instanceof(Array);
      data.length.should.be.above(0);

      done();
    });
  });

  it('should return app version', function(done) {
    var self = this;

    var jobs = [];

    var options = { id: self.id };

    jobs.push(function(cb) {
      self.marathon.apps.versions(self.id, function(err, data) {
        should.not.exist(err);

        should(data).be.instanceof(Array);
        data.length.should.be.above(0);

        options.version = data[0];

        cb();
      });
    });

    jobs.push(function(cb) {
      self.marathon.apps.version(options, function(err, data) {
        should.not.exist(err);

        should.exist(data);

        data.should.have.properties('id', 'cmd');

        data.id.should.eql(self.id);

        cb();
      });
    });

    async.series(jobs, done);
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

  it('should return tasks', function(done) {
    var self = this;

    helper.waitOnTask(self.marathon, self.id, function(err, data) {
      should.not.exist(err);

      should(data).be.instanceof(Array);
      data.length.should.be.above(0);

      var task = data[0];

      task.should.have.properties(
        'appId',
        'id',
        'host',
        'ports',
        'version'
      );

      task.appId.should.eql(self.id);

      done();
    });
  });

  it('should kill task', function(done) {
    var self = this;

    var jobs = [];

    jobs.task = function(cb) {
      helper.waitOnTask(self.marathon, self.id, function(err, data) {
        should.not.exist(err);

        should(data).be.instanceof(Array);
        data.length.should.be.above(0);

        var task = data[0];

        task.should.have.property('id');

        cb(null, task);
      });
    };

    jobs.kill = ['task', function(cb, results) {
      var options = {
        id: self.id,
        task: results.task.id,
      };

      self.marathon.apps.kill(options, function(err) {
        should.not.exist(err);

        cb();
      });
    }];

    jobs.check = ['kill', 'task', function(cb, results) {
      self.marathon.apps.tasks(self.id, function(err, data) {
        should.not.exist(err);

        should(data).be.instanceof(Array);

        var tasks = data.filter(function(task) {
          return task.id === results.task.id;
        });

        tasks.should.eql([]);

        cb();
      });
    }];

    async.auto(jobs, done);
  });
});
