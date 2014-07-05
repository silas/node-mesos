/**
 * Event subscriptions
 */

'use strict';

/**
 * Initialize a new `EventSubscriptions` client.
 */

function EventSubscriptions(marathon) {
  this.marathon = marathon;
}

/**
 * Register a callback URL as an event subscriber.
 */

EventSubscriptions.prototype.register = function(options, callback) {
  if (typeof options === 'string') {
    options = { url: options };
  }

  this.marathon.emit('debug', 'eventSubscriptions.register', options);

  if (!options.url) return callback(new Error('url required'));

  var req = {
    method: 'POST',
    path: '/eventSubscriptions',
    query: { callbackUrl: options.url },
  };

  this.marathon.request(req, function(err) {
    if (err) return callback(err);

    callback();
  });
};

/**
 * List all event subscriber callback URLs.
 */

EventSubscriptions.prototype.list = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  this.marathon.emit('debug', 'eventSubscriptions.list', options);

  var req = {
    method: 'GET',
    path: '/eventSubscriptions',
  };

  this.marathon.request(req, function(err, res) {
    if (err) return callback(err);

    callback(null, res.body.callbackUrls);
  });
};

/**
 * Unregister a callback URL from the event subscribers list.
 */

EventSubscriptions.prototype.unregister = function(options, callback) {
  if (typeof options === 'string') {
    options = { url: options };
  }

  this.marathon.emit('debug', 'eventSubscriptions.unregister', options);

  if (!options.url) return callback(new Error('url required'));

  var req = {
    method: 'DELETE',
    path: '/eventSubscriptions',
    query: { callbackUrl: options.url },
  };

  this.marathon.request(req, function(err) {
    if (err) return callback(err);

    callback();
  });
};

/**
 * Module Exports.
 */

exports.EventSubscriptions = EventSubscriptions;
