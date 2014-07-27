/**
 * Job client.
 */

'use strict';

/**
 * Module dependencies.
 */

var utils = require('../utils');

/**
 * Initialize a new `Job` client.
 */

function Job(chronos) {
  this.chronos = chronos;
}

/**
 * List jobs.
 */

Job.prototype.list = function(opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  this.chronos._log(['debug', 'jobs', 'list'], opts);

  var req = {
    name: 'job.list',
    path: '/jobs',
  };

  this.chronos._get(req, utils.bodyDefault([]), callback);
};

/**
 * Create job.
 */

Job.prototype.create = function(opts, callback) {
  opts = opts || {};

  this.chronos._log(['debug', 'jobs', 'create'], opts);

  var req = {
    name: 'job.create',
    path: '/iso8601',
    body: {
      name: opts.name,
      schedule: opts.schedule,
      command: opts.command,
      epsilon: opts.epsilon,
      owner: opts.owner,
    },
  };

  if (!opts.hasOwnProperty('async')) req.body.async = false;

  try {
    if (!opts.name) throw new Error('name required');
    if (!opts.schedule) throw new Error('schedule required');
    if (!opts.command) throw new Error('command required');
    if (!opts.epsilon) throw new Error('epsilon required');
    if (!opts.owner) throw new Error('owner required');
  } catch (err) {
    return callback(this.chronos._err(err, req));
  }

  this.chronos._post(req, utils.empty, callback);
};

/**
 * Delete job.
 */

Job.prototype.destroy = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { name: opts };
  } else {
    opts = opts || {};
  }

  this.chronos._log(['debug', 'jobs', 'destroy'], opts);

  var req = {
    name: 'job.destroy',
    path: '/job/{name}',
    params: { name: opts.name },
  };

  if (!opts.name) return callback(this.chronos._err('name required', req));

  this.chronos._delete(req, utils.empty, callback);
};

/**
 * Start job.
 */

Job.prototype.start = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { name: opts };
  } else {
    opts = opts || {};
  }

  this.chronos._log(['debug', 'jobs', 'start'], opts);

  var req = {
    name: 'job.start',
    path: '/job/{name}',
    params: { name: opts.name },
  };

  if (!opts.name) return callback(this.chronos._err('name required', req));

  this.chronos._put(req, utils.empty, callback);
};

/**
 * Stats.
 */

Job.prototype.stats = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { name: opts };
  } else {
    opts = opts || {};
  }

  this.chronos._log(['debug', 'jobs', 'stats'], opts);

  var req = {
    name: 'job.stats',
    params: {},
  };

  if (opts.name) {
    req.path = '/job/stat/{name}';
    req.params.name = opts.name;
  } else if (opts.percentile) {
    req.path = '/stats/{percentile}';
    req.params.percentile = opts.percentile;
  } else {
    return callback(this.chronos._err('name or percentile required', req));
  }

  this.chronos._get(req, utils.body, callback);
};

/**
 * Search jobs.
 */

Job.prototype.search = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { name: opts };
  } else if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  } else {
    opts = opts || {};
  }

  this.chronos._log(['debug', 'jobs', 'search'], opts);

  var req = {
    name: 'job.search',
    path: '/jobs/search',
    query: {},
  };

  if (opts.any) req.query.any = opts.any;
  if (opts.name) req.query.name = opts.name;
  if (opts.command) req.query.command = opts.command;
  if (opts.limit) req.query.limit = opts.limit;
  if (opts.offset) req.query.offset = opts.offset;

  this.chronos._get(req, utils.body, callback);
};

/**
 * Module Exports.
 */

exports.Job = Job;
