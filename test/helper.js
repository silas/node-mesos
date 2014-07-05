'use strict';

/**
 * Module dependencies.
 */

require('should');

/**
 * Buffer to string
 */

function bufferToString(value) {
  if (!value) return value;

  if (Buffer.isBuffer(value)) return value.toString();

  if (Array.isArray(value)) {
    return value.map(bufferToString);
  }

  if (typeof value === 'object') {
    Object.keys(value).forEach(function(key) {
      value[key] = bufferToString(value[key]);
    });
  }

  return value;
}

/**
 * Debug (convert buffers to strings)
 */

function debugBuffer(name) {
  var debug = require('debug')(name);

  return function() {
    debug.apply(debug, bufferToString(Array.prototype.slice.call(arguments)));
  };
}

/**
 * Module Exports.
 */

exports.debug = debugBuffer;
