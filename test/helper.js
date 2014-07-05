'use strict';

/**
 * Module dependencies.
 */

require('should');

/**
 * Debug w/ buffers
 */

function debugBuffer(name) {
  var debug = require('debug')(name);

  return function() {
    debug.apply(
      debug,
      Array.prototype.slice.call(arguments).map(function(data) {
        return Buffer.isBuffer(data) ? data.toString() : data;
      })
    );
  };
}

/**
 * Module Exports.
 */

exports.debug = debugBuffer;
