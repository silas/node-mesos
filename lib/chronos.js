/**
 * Chronos client.
 */

'use strict';

/**
 * Module dependencies.
 */

var rapi = require('rapi');
var util = require('util');

/**
 * Initialize a new `Chronos` client.
 *
 * @param {Object} options
 */

function Chronos(options) {
  if (!(this instanceof Chronos)) {
    return new Chronos(options);
  }

  options = options || {};

  if (!options.baseUrl) {
    options.baseUrl = (options.secure ? 'https:' : 'http:') + '//' +
      (options.host || '127.0.0.1') + ':' +
      (options.port || '4400') + '/scheduler';
  }

  rapi.Rapi.call(this, options);
}

util.inherits(Chronos, rapi.Rapi);

/**
 * Request
 */

Chronos.prototype.request = function(options, callback) {
  if (!options.type) options.type = 'json';
  return rapi.Rapi.prototype.request.call(this, options, callback);
};

/**
 * List jobs.
 */

Chronos.prototype.list = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  this.emit('debug', 'list', options);

  var req = {
    method: 'GET',
    path: '/jobs',
  };

  this.request(req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body || []);
  });
};

/**
 * Create job.
 */

Chronos.prototype.create = function(options, callback) {
  options = options || {};

  this.emit('debug', 'create', options);

  if (!options.name) return callback(new Error('name required'));
  if (!options.schedule) return callback(new Error('schedule required'));
  if (!options.command) return callback(new Error('command required'));
  if (!options.epsilon) return callback(new Error('epsilon required'));
  if (!options.owner) return callback(new Error('owner required'));
  if (!options.hasOwnProperty('async')) {
    return callback(new Error('async required'));
  }

  var req = {
    method: 'POST',
    path: '/iso8601',
    type: 'json',
    body: {
      name: options.name,
      schedule: options.schedule,
      command: options.command,
      epsilon: options.epsilon,
      owner: options.owner,
      async: options.async,
    },
  };

  this.request(req, function(err) {
    if (err) return callback(err);

    callback();
  });
};

/**
 * Module Exports.
 */

exports.Chronos = Chronos;
