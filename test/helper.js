'use strict';

/**
 * Module dependencies.
 */

require('should');

var async = require('async');

/**
 * Buffer to string
 */

function bufferToString(value) {
  if (!value) return value;

  if (Buffer.isBuffer(value)) return value.toString();

  if (Array.isArray(value)) {
    return value.map(bufferToString);
  }

  if (typeof value === 'object') {
    Object.keys(value).forEach(function(key) {
      value[key] = bufferToString(value[key]);
    });
  }

  return value;
}

/**
 * Debug (convert buffers to strings)
 */

function debugBuffer(name) {
  var debug = require('debug')(name);

  return function() {
    debug.apply(debug, bufferToString(Array.prototype.slice.call(arguments)));
  };
}

/**
 * Wait on task
 */

function waitOnTask(marathon, id, callback) {
  async.retry(
    100,
    function(cb) {
      marathon.apps.tasks(id, function(err, data) {
        if (err || !data || !data.length) {
          if (!err) err = new Error('No tasks found');
          return setTimeout(function() { cb(err); }, 100);
        }

        cb(null, data);
      });
    },
    callback
  );
}

/**
 * Marathon cleanup
 */

function cleanMarathon(test, callback) {
  var jobs = {};

  jobs.eventSubscriptions = function(cb) {
    test.marathon.eventSubscriptions.unregister(test.callbackUrl, cb);
  };

  jobs.list = test.marathon.apps.list.bind(test);

  jobs.destroy = ['list', function(cb, results) {
    var ids = results.list.map(function(app) {
      return app.id;
    }).filter(function(id) {
      return id.match(/^test-/);
    });

    if (!ids.length) return cb();

    async.map(ids, test.marathon.apps.destroy.bind(test), cb);
  }];

  async.auto(jobs, callback);
}

/**
 * Module Exports.
 */

exports.debug = debugBuffer;
exports.waitOnTask = waitOnTask;
exports.cleanMarathon = cleanMarathon;
