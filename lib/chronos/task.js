/**
 * Task client.
 */

'use strict';

/**
 * Module dependencies.
 */

var utils = require('../utils');

/**
 * Initialize a new `Task` client.
 */

function Task(chronos) {
  this.chronos = chronos;
}

/**
 * Update task.
 */

Task.prototype.update = function(opts, callback) {
  opts = opts || {};

  var req = {
    name: 'task.update',
    path: '/task/{id}',
    params: { id: opts.id },
    body: { statusCode: opts.statusCode },
  };

  try {
    if (!opts.id) throw new Error('id required');
    if (!opts.hasOwnProperty('statusCode')) {
      throw new Error('statusCode required');
    }
  } catch (err) {
    return callback(this.chronos._err(err, req));
  }

  this.chronos._put(req, utils.empty, callback);
};

/**
 * Kill tasks.
 */

Task.prototype.kill = function(opts, callback) {
  opts = opts || {};

  var req = {
    name: 'task.kill',
    path: '/task/kill/{job}',
    params: { job: opts.job },
  };

  if (!opts.job) return callback(this.chronos._err('job required', req));

  this.chronos._delete(req, utils.empty, callback);
};

/**
 * Module Exports.
 */

exports.Task = Task;
