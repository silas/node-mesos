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
 * Module Exports.
 */

exports.debug = debugBuffer;
exports.waitOnTask = waitOnTask;
