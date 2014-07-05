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
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

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
 * List the application with id appId.
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
 * Module Exports.
 */

exports.Apps = Apps;
