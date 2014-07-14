/**
 * Event subscription client
 */

'use strict';

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

  if (!opts.url) return callback(new Error('url required'));

  var req = {
    query: { callbackUrl: opts.url },
  };

  this.marathon._post('/eventSubscriptions', req, function(err) {
    if (err) return callback(err);

    callback();
  });
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

  this.marathon._get('/eventSubscriptions', function(err, res) {
    if (err) return callback(err);

    callback(null, res.body.callbackUrls);
  });
};

/**
 * Unregister a callback URL from the event subscribers list.
 */

EventSubscription.prototype.unregister = function(opts, callback) {
  if (typeof opts === 'string') {
    opts = { url: opts };
  }

  this.marathon._log(['debug', 'eventSubscriptions', 'unregister'], opts);

  if (!opts.url) return callback(new Error('url required'));

  var req = {
    query: { callbackUrl: opts.url },
  };

  this.marathon._delete('/eventSubscriptions', req, function(err) {
    if (err) return callback(err);

    callback();
  });
};

/**
 * Module Exports.
 */

exports.EventSubscription = EventSubscription;
