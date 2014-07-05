'use strict';

/**
 * Module dependencies.
 */

require('should');

var async = require('async');

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
 * Clean
 */

function clean(test, callback) {
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

exports.waitOnTask = waitOnTask;
exports.clean = clean;
