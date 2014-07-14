/**
 * Marathon client.
 */

'use strict';

/**
 * Module dependencies.
 */

var rapi = require('rapi');
var util = require('util');

var App = require('./marathon/app').App;
var EventSubscription = require('./marathon/event_subscription')
  .EventSubscription;

/**
 * Initialize a new `Marathon` client.
 *
 * @param {Object} opts
 */

function Marathon(opts) {
  if (!(this instanceof Marathon)) {
    return new Marathon(opts);
  }

  opts = opts || {};

  if (!opts.baseUrl) {
    opts.baseUrl = (opts.secure ? 'https:' : 'http:') + '//' +
      (opts.host || '127.0.0.1') + ':' +
      (opts.port || '8080') + '/v2';
  }
  opts.type = 'json';

  rapi.Client.call(this, opts);

  this.app = new App(this);
  this.eventSubscription = new EventSubscription(this);
}

util.inherits(Marathon, rapi.Client);

/**
 * List tasks of all running applications.
 */

Marathon.prototype.tasks = function(opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  this._log(['debug', 'tasks'], opts);

  this._get('/tasks', function(err, res) {
    if (err) return callback(err);

    callback(null, res.body.tasks);
  });
};

/**
 * Module Exports.
 */

exports.Marathon = Marathon;
