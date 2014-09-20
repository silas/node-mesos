/**
 * Marathon client.
 */

'use strict';

/**
 * Module dependencies.
 */

var papi = require('papi');
var util = require('util');

var App = require('./marathon/app').App;
var EventSubscription = require('./marathon/event_subscription')
  .EventSubscription;
var utils = require('./utils');

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
  opts.name = 'marathon';
  opts.type = 'json';

  papi.Client.call(this, opts);

  this.app = new App(this);
  this.eventSubscription = new EventSubscription(this);
}

util.inherits(Marathon, papi.Client);

/**
 * List tasks of all running applications.
 */

Marathon.prototype.tasks = function(opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  var req = {
    name: 'tasks',
    path: '/tasks',
  };

  this._get(req, utils.bodyItem('tasks'), callback);
};

/**
 * Module Exports.
 */

exports.Marathon = Marathon;
