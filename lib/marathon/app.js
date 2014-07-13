/**
 * App information
 */

'use strict';

/**
 * Initialize a new `App` client.
 */

function App(marathon) {
  this.marathon = marathon;
}

/**
 * Create and start a new application.
 */

App.prototype.create = function(options, callback) {
  options = options || {};

  this.marathon._log(['debug', 'apps', 'create'], options);

  if (!options.id) return callback(new Error('id required'));
  if (!options.cpus) return callback(new Error('cpus required'));
  if (!options.mem) return callback(new Error('mem required'));
  if (!options.instances) return callback(new Error('instances required'));

  if (!options.cmd && !options.executor && !options.image) {
    return callback(new Error('cmd, executor or image required'));
  }

  var req = {
    body: options,
  };

  this.marathon._post('/apps', req, function(err) {
    if (err) return callback(err);

    callback();
  });
};

/**
 * List all running applications.
 */

App.prototype.list = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  this.marathon._log(['debug', 'apps', 'list'], options);

  var req = {
    query: {},
  };

  if (options.cmd) req.query.cmd = options.cmd;

  this.marathon._get('/apps', req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body.apps);
  });
};

/**
 * List the application with application id.
 */

App.prototype.get = function(options, callback) {
  if (typeof options === 'string') {
    options = { id: options };
  }

  this.marathon._log(['debug', 'apps', 'get'], options);

  if (!options.id) return callback(new Error('id required'));

  var req = {
    path: { id: options.id },
  };

  this.marathon._get('/apps/{id}', req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body.app);
  });
};

/**
 * List the versions of the application with id.
 */

App.prototype.versions = function(options, callback) {
  if (typeof options === 'string') {
    options = { id: options };
  }

  this.marathon._log(['debug', 'apps', 'versions'], options);

  if (!options.id) return callback(new Error('id required'));

  var req = {
    path: { id: options.id },
  };

  this.marathon._get('/apps/{id}/versions', req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body.versions);
  });
};

/**
 * List the configuration of the application with id at version.
 */

App.prototype.version = function(options, callback) {
  options = options || {};

  this.marathon._log(['debug', 'apps', 'version'], options);

  if (!options.id) return callback(new Error('id required'));
  if (!options.version) return callback(new Error('version required'));

  var req = {
    path: { id: options.id, version: options.version },
  };

  this.marathon._get('/apps/{id}/versions/{version}', req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body);
  });
};

/**
 * Change parameters of a running application. The new application parameters
 * apply only to subsequently created tasks, and currently running tasks are
 * not pre-emptively restarted.
 */

App.prototype.update = function(options, callback) {
  options = options || {};

  this.marathon._log(['debug', 'apps', 'update'], options);

  if (!options.id) return callback(new Error('id required'));

  var req = {
    path: { id: options.id },
    body: options,
  };

  this.marathon._put('/apps/{id}', req, function(err) {
    if (err) return callback(err);

    callback();
  });
};

/**
 * Destroy an application. All data about that application will be deleted.
 */

App.prototype.destroy = function(options, callback) {
  if (typeof options === 'string') {
    options = { id: options };
  }

  this.marathon._log(['debug', 'apps', 'destroy'], options);

  if (!options.id) return callback(new Error('id required'));

  var req = {
    path: { id: options.id },
  };

  this.marathon._delete('/apps/{id}', req, function(err) {
    if (err) return callback(err);

    callback();
  });
};

/**
 * List all running tasks for application id.
 */

App.prototype.tasks = function(options, callback) {
  if (typeof options === 'string') {
    options = { id: options };
  }

  this.marathon._log(['debug', 'apps', 'tasks'], options);

  if (!options.id) return callback(new Error('id required'));

  var req = {
    path: { id: options.id },
  };

  this.marathon._get('/apps/{id}/tasks', req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body.tasks);
  });
};

/**
 * Kill tasks that belong to the application id.
 */

App.prototype.kill = function(options, callback) {
  if (typeof options === 'string') {
    options = { id: options };
  }

  this.marathon._log(['debug', 'apps', 'kill'], options);

  if (!options.id) return callback(new Error('id required'));

  var req = {
    path: { id: options.id },
    query: {},
  };
  var path = '/apps/{id}/tasks';

  if (options.task) {
    path += '/{task}';
    req.path.task = options.task;
    if (options.host) return callback(new Error('host invalid with task'));
  }

  if (options.host) req.query.host = options.host;
  if (options.scale) req.query.scale = options.scale ? 'true' : 'false';

  this.marathon._delete(path, req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body.tasks);
  });
};

/**
 * Module Exports.
 */

exports.App = App;
