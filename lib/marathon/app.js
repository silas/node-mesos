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

App.prototype.create = function(opts, callback) {
  opts = opts || {};

  this.marathon._log(['debug', 'apps', 'create'], opts);

  if (!opts.id) return callback(new Error('id required'));
  if (!opts.cpus) return callback(new Error('cpus required'));
  if (!opts.mem) return callback(new Error('mem required'));
  if (!opts.instances) return callback(new Error('instances required'));

  if (!opts.cmd && !opts.executor && !opts.image) {
    return callback(new Error('cmd, executor or image required'));
  }

  var req = {
    body: opts,
  };

  this.marathon._post('/apps', req, function(err) {
    if (err) return callback(err);

    callback();
  });
};

/**
 * List all running applications.
 */

App.prototype.list = function(opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  this.marathon._log(['debug', 'apps', 'list'], opts);

  var req = {
    query: {},
  };

  if (opts.cmd) req.query.cmd = opts.cmd;

  this.marathon._get('/apps', req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body.apps);
  });
};

/**
 * List the application with application id.
 */

App.prototype.get = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { id: opts };
  }

  this.marathon._log(['debug', 'apps', 'get'], opts);

  if (!opts.id) return callback(new Error('id required'));

  var req = {
    path: { id: opts.id },
  };

  this.marathon._get('/apps/{id}', req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body.app);
  });
};

/**
 * List the versions of the application with id.
 */

App.prototype.versions = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { id: opts };
  }

  this.marathon._log(['debug', 'apps', 'versions'], opts);

  if (!opts.id) return callback(new Error('id required'));

  var req = {
    path: { id: opts.id },
  };

  this.marathon._get('/apps/{id}/versions', req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body.versions);
  });
};

/**
 * List the configuration of the application with id at version.
 */

App.prototype.version = function(opts, callback) {
  opts = opts || {};

  this.marathon._log(['debug', 'apps', 'version'], opts);

  if (!opts.id) return callback(new Error('id required'));
  if (!opts.version) return callback(new Error('version required'));

  var req = {
    path: { id: opts.id, version: opts.version },
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

App.prototype.update = function(opts, callback) {
  opts = opts || {};

  this.marathon._log(['debug', 'apps', 'update'], opts);

  if (!opts.id) return callback(new Error('id required'));

  var req = {
    path: { id: opts.id },
    body: opts,
  };

  this.marathon._put('/apps/{id}', req, function(err) {
    if (err) return callback(err);

    callback();
  });
};

/**
 * Destroy an application. All data about that application will be deleted.
 */

App.prototype.destroy = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { id: opts };
  }

  this.marathon._log(['debug', 'apps', 'destroy'], opts);

  if (!opts.id) return callback(new Error('id required'));

  var req = {
    path: { id: opts.id },
  };

  this.marathon._delete('/apps/{id}', req, function(err) {
    if (err) return callback(err);

    callback();
  });
};

/**
 * List all running tasks for application id.
 */

App.prototype.tasks = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { id: opts };
  }

  this.marathon._log(['debug', 'apps', 'tasks'], opts);

  if (!opts.id) return callback(new Error('id required'));

  var req = {
    path: { id: opts.id },
  };

  this.marathon._get('/apps/{id}/tasks', req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body.tasks);
  });
};

/**
 * Kill tasks that belong to the application id.
 */

App.prototype.kill = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { id: opts };
  }

  this.marathon._log(['debug', 'apps', 'kill'], opts);

  if (!opts.id) return callback(new Error('id required'));

  var req = {
    path: { id: opts.id },
    query: {},
  };
  var path = '/apps/{id}/tasks';

  if (opts.task) {
    path += '/{task}';
    req.path.task = opts.task;
    if (opts.host) return callback(new Error('host invalid with task'));
  }

  if (opts.host) req.query.host = opts.host;
  if (opts.scale) req.query.scale = opts.scale ? 'true' : 'false';

  this.marathon._delete(path, req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body.tasks);
  });
};

/**
 * Module Exports.
 */

exports.App = App;
