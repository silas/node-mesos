/**
 * Job client.
 */

'use strict';

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

  this.chronos._get('/jobs', function(err, res) {
    if (err) return callback(err);

    callback(null, res.body || []);
  });
};

/**
 * Create job.
 */

Job.prototype.create = function(opts, callback) {
  opts = opts || {};

  this.chronos._log(['debug', 'jobs', 'create'], opts);

  if (!opts.name) return callback(new Error('name required'));
  if (!opts.schedule) return callback(new Error('schedule required'));
  if (!opts.command) return callback(new Error('command required'));
  if (!opts.epsilon) return callback(new Error('epsilon required'));
  if (!opts.owner) return callback(new Error('owner required'));
  if (!opts.hasOwnProperty('async')) opts.async = false;

  var req = {
    body: {
      name: opts.name,
      schedule: opts.schedule,
      command: opts.command,
      epsilon: opts.epsilon,
      owner: opts.owner,
      async: opts.async,
    },
  };

  this.chronos._post('/iso8601', req, function(err) {
    if (err) return callback(err);

    callback();
  });
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

  if (!opts.name) return callback(new Error('name required'));

  var req = {
    path: { name: opts.name },
  };

  this.chronos._delete('/job/{name}', req, function(err) {
    if (err) return callback(err);

    callback();
  });
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

  if (!opts.name) return callback(new Error('name required'));

  var req = {
    path: { name: opts.name },
  };

  this.chronos._put('/job/{name}', req, function(err) {
    if (err) return callback(err);

    callback();
  });
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

  var req = { path: {} };
  var path;

  if (opts.name) {
    path = '/job/stat/{name}';
    req.path.name = opts.name;
  } else if (opts.percentile) {
    path = '/stats/{percentile}';
    req.path.percentile = opts.percentile;
  } else {
    return callback(new Error('name or percentile required'));
  }

  this.chronos._get(path, req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body);
  });
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
    query: {},
  };

  if (opts.any) req.query.any = opts.any;
  if (opts.name) req.query.name = opts.name;
  if (opts.command) req.query.command = opts.command;
  if (opts.limit) req.query.limit = opts.limit;
  if (opts.offset) req.query.offset = opts.offset;

  this.chronos._get('/jobs/search', req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body);
  });
};

/**
 * Module Exports.
 */

exports.Job = Job;
