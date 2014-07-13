/**
 * Marathon client.
 */

'use strict';

/**
 * Module dependencies.
 */

var Rapi = require('rapi').Rapi;
var util = require('util');

var App = require('./marathon/app').App;
var EventSubscription = require('./marathon/event_subscription')
  .EventSubscription;

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
  options.type = 'json';

  Rapi.call(this, options);

  this.app = new App(this);
  this.eventSubscription = new EventSubscription(this);
}

util.inherits(Marathon, Rapi);

/**
 * List tasks of all running applications.
 */

Marathon.prototype.tasks = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  this._log(['debug', 'tasks'], options);

  this._get('/tasks', function(err, res) {
    if (err) return callback(err);

    callback(null, res.body.tasks);
  });
};

/**
 * Module Exports.
 */

exports.Marathon = Marathon;
