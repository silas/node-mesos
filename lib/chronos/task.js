/**
 * Task client.
 */

'use strict';

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

  this.chronos._log(['debug', 'tasks', 'update'], opts);

  if (!opts.id) return callback(new Error('id required'));
  if (!opts.hasOwnProperty('statusCode')) {
    return callback(new Error('statusCode required'));
  }

  var req = {
    path: { id: opts.id },
    body: { statusCode: opts.statusCode },
  };

  this.chronos._put('/task/{id}', req, function(err) {
    if (err) return callback(err);

    callback();
  });
};

/**
 * Kill tasks.
 */

Task.prototype.kill = function(opts, callback) {
  opts = opts || {};

  this.chronos._log(['debug', 'tasks', 'kill'], opts);

  if (!opts.job) return callback(new Error('job required'));

  var req = {
    path: { job: opts.job },
  };

  this.chronos._delete('/task/kill/{job}', req, function(err) {
    if (err) return callback(err);

    callback();
  });
};

/**
 * Module Exports.
 */

exports.Task = Task;
