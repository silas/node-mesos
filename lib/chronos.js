/**
 * Chronos client.
 */

'use strict';

/**
 * Module dependencies.
 */

var rapi = require('rapi');
var util = require('util');

var Job = require('./chronos/job').Job;
var Task = require('./chronos/task').Task;

/**
 * Initialize a new `Chronos` client.
 *
 * @param {Object} opts
 */

function Chronos(opts) {
  if (!(this instanceof Chronos)) {
    return new Chronos(opts);
  }

  opts = opts || {};

  if (!opts.baseUrl) {
    opts.baseUrl = (opts.secure ? 'https:' : 'http:') + '//' +
      (opts.host || '127.0.0.1') + ':' +
      (opts.port || '4400') + '/scheduler';
  }
  opts.type = 'json';

  rapi.Client.call(this, opts);

  this.job = new Job(this);
  this.task = new Task(this);
}

util.inherits(Chronos, rapi.Client);

/**
 * Module Exports.
 */

exports.Chronos = Chronos;
