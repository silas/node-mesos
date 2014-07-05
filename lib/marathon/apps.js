/**
 * Apps information
 */

'use strict';

/**
 * Initialize a new `Apps` client.
 */

function Apps(marathon) {
  this.marathon = marathon;
}

/**
 * Create and start a new application.
 */

Apps.prototype.create = function(options, callback) {
  options = options || {};

  this.marathon.emit('debug', 'apps.create', options);

  if (!options.id) return callback(new Error('id required'));
  if (!options.cpus) return callback(new Error('cpus required'));
  if (!options.mem) return callback(new Error('mem required'));
  if (!options.instances) return callback(new Error('instances required'));

  if (!options.cmd && !options.executor && !options.image) {
    return callback(new Error('cmd, executor or image required'));
  }

  var req = {
    method: 'POST',
    path: '/apps',
    type: 'json',
    body: options,
  };

  this.marathon.request(req, function(err) {
    if (err) return callback(err);

    callback();
  });
};

/**
 * List all running applications.
 */

Apps.prototype.list = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  this.marathon.emit('debug', 'apps.list', options);

  var req = {
    method: 'GET',
    path: '/apps',
    query: {},
  };

  if (options.cmd) req.query.cmd = options.cmd;

  this.marathon.request(req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body.apps);
  });
};

/**
 * List the application with application id.
 */

Apps.prototype.get = function(options, callback) {
  if (typeof options === 'string') {
    options = { id: options };
  }

  this.marathon.emit('debug', 'apps.get', options);

  if (!options.id) return callback(new Error('id required'));

  var req = {
    method: 'GET',
    path: '/apps/' + options.id,
  };

  this.marathon.request(req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body.app);
  });
};

/**
 * List the versions of the application with id.
 */

Apps.prototype.versions = function(options, callback) {
  if (typeof options === 'string') {
    options = { id: options };
  }

  this.marathon.emit('debug', 'apps.versions', options);

  if (!options.id) return callback(new Error('id required'));

  var req = {
    method: 'GET',
    path: '/apps/' + options.id + '/versions',
  };

  this.marathon.request(req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body.versions);
  });
};

/**
 * List the configuration of the application with id at version.
 */

Apps.prototype.version = function(options, callback) {
  options = options || {};

  this.marathon.emit('debug', 'apps.version', options);

  if (!options.id) return callback(new Error('id required'));
  if (!options.version) return callback(new Error('version required'));

  var req = {
    method: 'GET',
    path: '/apps/' + options.id + '/versions/' + options.version,
  };

  this.marathon.request(req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body);
  });
};

/**
 * Change parameters of a running application. The new application parameters
 * apply only to subsequently created tasks, and currently running tasks are
 * not pre-emptively restarted.
 */

Apps.prototype.update = function(options, callback) {
  options = options || {};

  this.marathon.emit('debug', 'apps.update', options);

  if (!options.id) return callback(new Error('id required'));

  var req = {
    method: 'PUT',
    path: '/apps/' + options.id,
    type: 'json',
    body: options,
  };

  this.marathon.request(req, function(err) {
    if (err) return callback(err);

    callback();
  });
};

/**
 * Destroy an application. All data about that application will be deleted.
 */

Apps.prototype.destroy = function(options, callback) {
  if (typeof options === 'string') {
    options = { id: options };
  }

  this.marathon.emit('debug', 'apps.destroy', options);

  if (!options.id) return callback(new Error('id required'));

  var req = {
    method: 'DELETE',
    path: '/apps/' + options.id,
  };

  this.marathon.request(req, function(err) {
    if (err) return callback(err);

    callback();
  });
};

/**
 * List all running tasks for application id.
 */

Apps.prototype.tasks = function(options, callback) {
  if (typeof options === 'string') {
    options = { id: options };
  }

  this.marathon.emit('debug', 'apps.tasks', options);

  if (!options.id) return callback(new Error('id required'));

  var req = {
    method: 'GET',
    path: '/apps/' + options.id + '/tasks',
  };

  this.marathon.request(req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body.tasks);
  });
};

/**
 * Kill tasks that belong to the application id.
 */

Apps.prototype.kill = function(options, callback) {
  if (typeof options === 'string') {
    options = { id: options };
  }

  this.marathon.emit('debug', 'apps.kill', options);

  if (!options.id) return callback(new Error('id required'));

  var req = {
    method: 'DELETE',
    path: '/apps/' + options.id + '/tasks',
    query: {},
  };

  if (options.task) {
    req.path += '/' + options.task;
    if (options.host) return callback(new Error('host invalid with task'));
  }

  if (options.host) req.query.host = options.host;
  if (options.scale) req.query.scale = options.scale ? 'true' : 'false';

  this.marathon.request(req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body.tasks);
  });
};

/**
 * Module Exports.
 */

exports.Apps = Apps;
