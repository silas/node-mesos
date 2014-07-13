/**
 * Chronos client.
 */

'use strict';

/**
 * Module dependencies.
 */

var Rapi = require('rapi').Rapi;
var util = require('util');

var Jobs = require('./chronos/jobs').Jobs;
var Tasks = require('./chronos/tasks').Tasks;

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

  this.jobs = new Jobs(this);
  this.tasks = new Tasks(this);
}

util.inherits(Chronos, Rapi);

/**
 * Module Exports.
 */

exports.Chronos = Chronos;
