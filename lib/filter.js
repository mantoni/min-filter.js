/*
 * min-filter.js
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

function errorDone(err, done) {
  return function () {
    if (done) {
      done(err);
    }
  };
}

function filter(it, scope, then, done) {
  var f = it.next();
  if (f) {
    if (f.length) {
      try {
        f.call(scope, function next(cb) {
          filter(it, scope, then, cb || done);
        }, done);
      } catch (e) {
        filter(it, scope, then, errorDone(e, done));
      }
    } else {
      try {
        f.call(scope);
        filter(it, scope, then, done);
      } catch (e) {
        filter(it, scope, then, errorDone(e, done));
      }
    }
  } else if (then) {
    try {
      then.call(scope, done);
    } catch (e) {
      done(e);
      return;
    }
    if (!then.length) {
      done();
    }
  } else if (done) {
    done();
  }
}

module.exports = function (it, scope, then, done) {
  if (!done) {
    done = then;
    then = null;
  }
  if (typeof scope === 'function') {
    if (done) {
      then = scope;
    } else {
      done = scope;
    }
    scope = null;
  }
  filter(it, scope, then, done);
};
