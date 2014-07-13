/**
 * Chronos client.
 */

'use strict';

/**
 * Module dependencies.
 */

var Rapi = require('rapi').Rapi;
var util = require('util');

var Job = require('./chronos/job').Job;
var Task = require('./chronos/task').Task;

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
  options.type = 'json';

  Rapi.call(this, options);

  this.job = new Job(this);
  this.task = new Task(this);
}

util.inherits(Chronos, Rapi);

/**
 * Module Exports.
 */

exports.Chronos = Chronos;
