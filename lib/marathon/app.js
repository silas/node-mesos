/**
 * App information
 */

'use strict';

/**
 * Module dependencies.
 */

var utils = require('../utils');

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

  var req = {
    name: 'app.create',
    path: '/apps',
  };

  try {
    if (!opts.id) throw new Error('id required');
    if (!opts.cpus) throw new Error('cpus required');
    if (!opts.mem) throw new Error('mem required');
    if (!opts.instances) throw new Error('instances required');

    if (!opts.args && !opts.cmd && !opts.executor && !opts.image) {
      throw new Error('args, cmd, executor or image required');
    }
    if (opts.args && opts.cmd) {
      throw new Error('provide args or cmd, but not both');
    }
  } catch (err) {
    return callback(this.marathon._err(err, req));
  }

  req.body = opts;

  this.marathon._post(req, utils.empty, callback);
};

/**
 * List all running applications.
 */

App.prototype.list = function(opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  var req = {
    name: 'app.list',
    path: '/apps',
    query: {},
  };

  if (opts.cmd) req.query.cmd = opts.cmd;

  this.marathon._get(req, utils.bodyItem('apps'), callback);
};

/**
 * List the application with application id.
 */

App.prototype.get = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { id: opts };
  }

  var req = {
    name: 'app.get',
    path: '/apps/{id}',
    params: { id: opts.id },
  };

  if (!opts.id) return callback(this.marathon._err('id required', req));

  this.marathon._get(req, utils.bodyItem('app'), callback);
};

/**
 * List the versions of the application with id.
 */

App.prototype.versions = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { id: opts };
  }

  var req = {
    name: 'app.versions',
    path: '/apps/{id}/versions',
    params: { id: opts.id },
  };

  if (!opts.id) return callback(this.marathon._err('id required', req));

  this.marathon._get(req, utils.bodyItem('versions'), callback);
};

/**
 * List the configuration of the application with id at version.
 */

App.prototype.version = function(opts, callback) {
  opts = opts || {};

  var req = {
    name: 'app.version',
    path: '/apps/{id}/versions/{version}',
    params: { id: opts.id, version: opts.version },
  };

  try {
    if (!opts.id) throw new Error('id required');
    if (!opts.version) throw new Error('version required');
  } catch (err) {
    return callback(this.marathon._err(err, req));
  }

  this.marathon._get(req, utils.body, callback);
};

/**
 * Change parameters of a running application. The new application parameters
 * apply only to subsequently created tasks, and currently running tasks are
 * not pre-emptively restarted.
 */

App.prototype.update = function(opts, callback) {
  opts = opts || {};

  var req = {
    name: 'app.update',
    path: '/apps/{id}',
    params: { id: opts.id },
    query: {},
    body: opts,
  };

  if (!opts.id) return callback(this.marathon._err('id required', req));
  if (opts.force) req.query.force = true;

  this.marathon._put(req, utils.empty, callback);
};

/**
 * Destroy an application. All data about that application will be deleted.
 */

App.prototype.destroy = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { id: opts };
  }

  var req = {
    name: 'app.destroy',
    path: '/apps/{id}',
    params: { id: opts.id },
  };

  if (!opts.id) return callback(this.marathon._err('id required', req));

  this.marathon._delete(req, utils.empty, callback);
};

/**
 * List all running tasks for application id.
 */

App.prototype.tasks = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { id: opts };
  }

  var req = {
    name: 'app.tasks',
    path: '/apps/{id}/tasks',
    params: { id: opts.id },
  };

  if (!opts.id) return callback(this.marathon._err('id required', req));

  this.marathon._get(req, utils.bodyItem('tasks'), callback);
};

/**
 * Kill tasks that belong to the application id.
 */

App.prototype.kill = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { id: opts };
  }

  var req = {
    name: 'app.kill',
    path: '/apps/{id}/tasks',
    params: { id: opts.id },
    query: {},
  };

  try {
    if (!opts.id) throw new Error('id required');

    if (opts.task) {
      req.path += '/{task}';
      req.params.task = opts.task;
      if (opts.host) throw new Error('host invalid with task');
    }

    if (opts.host) req.query.host = opts.host;
    if (opts.scale) req.query.scale = opts.scale ? 'true' : 'false';
  } catch (err) {
    return callback(this.marathon._err(err, req));
  }

  console.log(req);

  this.marathon._delete(req, utils.bodyItem('tasks'), callback);
};

/**
 * Module Exports.
 */

exports.App = App;
