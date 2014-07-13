/**
 * Jobs client.
 */

'use strict';

/**
 * Initialize a new `Jobs` client.
 */

function Jobs(chronos) {
  this.chronos = chronos;
}

/**
 * List jobs.
 */

Jobs.prototype.list = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  this.chronos._log(['debug', 'jobs', 'list'], options);

  this.chronos._get('/jobs', function(err, res) {
    if (err) return callback(err);

    callback(null, res.body || []);
  });
};

/**
 * Create job.
 */

Jobs.prototype.create = function(options, callback) {
  options = options || {};

  this.chronos._log(['debug', 'jobs', 'create'], options);

  if (!options.name) return callback(new Error('name required'));
  if (!options.schedule) return callback(new Error('schedule required'));
  if (!options.command) return callback(new Error('command required'));
  if (!options.epsilon) return callback(new Error('epsilon required'));
  if (!options.owner) return callback(new Error('owner required'));
  if (!options.hasOwnProperty('async')) options.async = false;

  var req = {
    body: {
      name: options.name,
      schedule: options.schedule,
      command: options.command,
      epsilon: options.epsilon,
      owner: options.owner,
      async: options.async,
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

Jobs.prototype.destroy = function(options, callback) {
  if (typeof options === 'string') {
    options = { name: options };
  } else {
    options = options || {};
  }

  this.chronos._log(['debug', 'jobs', 'destroy'], options);

  if (!options.name) return callback(new Error('name required'));

  var req = {
    path: { name: options.name },
  };

  this.chronos._delete('/job/{name}', req, function(err) {
    if (err) return callback(err);

    callback();
  });
};

/**
 * Start job.
 */

Jobs.prototype.start = function(options, callback) {
  if (typeof options === 'string') {
    options = { name: options };
  } else {
    options = options || {};
  }

  this.chronos._log(['debug', 'jobs', 'start'], options);

  if (!options.name) return callback(new Error('name required'));

  var req = {
    path: { name: options.name },
  };

  this.chronos._put('/job/{name}', req, function(err) {
    if (err) return callback(err);

    callback();
  });
};

/**
 * Stats.
 */

Jobs.prototype.stats = function(options, callback) {
  if (typeof options === 'string') {
    options = { name: options };
  } else {
    options = options || {};
  }

  this.chronos._log(['debug', 'jobs', 'stats'], options);

  var req = { path: {} };
  var path;

  if (options.name) {
    path = '/job/{name}/stats';
    req.path.name = options.name;
  } else if (options.percentile) {
    path = '/stats/{percentile}';
    req.path.percentile = options.percentile;
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

Jobs.prototype.search = function(options, callback) {
  if (typeof options === 'string') {
    options = { any: options };
  } else if (typeof options === 'function') {
    callback = options;
    options = {};
  } else {
    options = options || {};
  }

  this.chronos._log(['debug', 'jobs', 'search'], options);

  var req = {
    query: {},
  };

  if (options.any) req.query.any = options.any;
  if (options.name) req.query.name = options.name;
  if (options.command) req.query.command = options.command;
  if (options.limit) req.query.limit = options.limit;
  if (options.offset) req.query.offset = options.offset;

  this.chronos._put('/jobs/search', req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body);
  });
};

/**
 * Module Exports.
 */

exports.Jobs = Jobs;
