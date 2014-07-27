/**
 * Event subscription client
 */

'use strict';

/**
 * Module dependencies.
 */

var utils = require('../utils');

/**
 * Initialize a new `EventSubscription` client.
 */

function EventSubscription(marathon) {
  this.marathon = marathon;
}

/**
 * Register a callback URL as an event subscriber.
 */

EventSubscription.prototype.register = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { url: opts };
  }

  this.marathon._log(['debug', 'eventSubscriptions', 'register'], opts);

  var req = {
    name: 'eventSubscription.register',
    path: '/eventSubscriptions',
    query: { callbackUrl: opts.url },
  };

  if (!opts.url) return callback(this.marathon._err('url required', req));

  this.marathon._post(req, utils.empty, callback);
};

/**
 * List all event subscriber callback URLs.
 */

EventSubscription.prototype.list = function(opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  this.marathon._log(['debug', 'eventSubscriptions', 'list'], opts);

  var req = {
    name: 'eventSubscription.list',
    path: '/eventSubscriptions',
  };

  this.marathon._get(req, utils.bodyItem('callbackUrls'), callback);
};

/**
 * Unregister a callback URL from the event subscribers list.
 */

EventSubscription.prototype.unregister = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { url: opts };
  }

  this.marathon._log(['debug', 'eventSubscriptions', 'unregister'], opts);

  var req = {
    name: 'eventSubscription.unregister',
    path: '/eventSubscriptions',
    query: { callbackUrl: opts.url },
  };

  if (!opts.url) return callback(this.marathon._err('url required', req));

  this.marathon._delete(req, utils.empty, callback);
};

/**
 * Module Exports.
 */

exports.EventSubscription = EventSubscription;
