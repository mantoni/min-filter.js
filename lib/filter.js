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

function filter(it, scope, done) {
  var f = it.next();
  if (f) {
    if (f.length) {
      try {
        f.call(scope, function next(cb) {
          filter(it, scope, cb || done);
        }, done);
      } catch (e) {
        filter(it, scope, errorDone(e, done));
      }
    } else {
      try {
        f.call(scope);
        filter(it, scope, done);
      } catch (e) {
        filter(it, scope, errorDone(e, done));
      }
    }
  } else if (done) {
    done();
  }
}

module.exports = function (it, scope, done) {
  if (typeof scope === 'function') {
    done = scope;
    scope = null;
  }
  filter(it, scope, done);
};
