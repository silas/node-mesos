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
var EventSubscriptions = require('./marathon/event_subscriptions')
  .EventSubscriptions;

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
  this.eventSubscriptions = new EventSubscriptions(this);
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
 * List tasks of all running applications.
 */

Marathon.prototype.tasks = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  this.emit('debug', 'tasks', options);

  var req = {
    method: 'GET',
    path: '/tasks',
  };

  this.request(req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body.tasks);
  });
};

/**
 * Module Exports.
 */

exports.Marathon = Marathon;
