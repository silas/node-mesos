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

    callback(null, res.body);
  });
};

/**
 * Module Exports.
 */

exports.Chronos = Chronos;
