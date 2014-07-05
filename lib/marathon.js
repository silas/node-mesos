/**
 * Marathon client.
 */

'use strict';

/**
 * Module dependencies.
 */

var rapi = require('rapi');
var util = require('util');

var Apps = require('./marathon/apps').Apps;

/**
 * Initialize a new `Marathon` client.
 *
 * @param {Object} options
 */

function Marathon(options) {
  if (!(this instanceof Marathon)) {
    return new Marathon(options);
  }

  options = options || {};

  if (!options.baseUrl) {
    options.baseUrl = (options.secure ? 'https:' : 'http:') + '//' +
      (options.host || '127.0.0.1') + ':' +
      (options.port || '8080') + '/v2';
  }

  rapi.Rapi.call(this, options);

  this.apps = new Apps(this);
}

util.inherits(Marathon, rapi.Rapi);

/**
 * Request
 */

Marathon.prototype.request = function(options, callback) {
  if (!options.type) options.type = 'json';
  return rapi.Rapi.prototype.request.call(this, options, callback);
};

/**
 * Module Exports.
 */

exports.Marathon = Marathon;
