'use strict';

/**
 * Body
 */

function body(ctx, next) {
  if (ctx.err) return next(ctx.err);

  next(false, null, ctx.res.body);
}

/**
 * Body default
 */

function bodyDefault(value) {
  return function(ctx, next) {
    if (ctx.err) return next(ctx.err);

    next(false, null, ctx.res.body || value);
  };
}

/**
 * Body item
 */

function bodyItem(key) {
  return function(ctx, next) {
    if (ctx.err) return next(ctx.err);

    next(false, null, ctx.res.body[key]);
  };
}

/**
 * Empty
 */

function empty(ctx, next) {
  if (ctx.err) return next(ctx.err);

  next(false);
}

/**
 * Module exports
 */

exports.body = body;
exports.bodyDefault = bodyDefault;
exports.bodyItem = bodyItem;
exports.empty = empty;
