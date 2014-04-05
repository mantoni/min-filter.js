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

module.exports = function filter(it, done) {
  var f = it.next();
  if (f) {
    if (f.length) {
      try {
        f(function next(cb) {
          filter(it, cb || done);
        }, done);
      } catch (e) {
        filter(it, errorDone(e, done));
      }
    } else {
      try {
        f();
        filter(it, done);
      } catch (e) {
        filter(it, errorDone(e, done));
      }
    }
  } else if (done) {
    done();
  }
};
