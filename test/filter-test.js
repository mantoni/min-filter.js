/*
 * min-filter.js
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
/*global describe, it, beforeEach*/
'use strict';

var assert = require('assert');
var filter = require('../lib/filter');

function iterator(arr) {
  var i = 0;
  return {
    next: function () {
      if (i < arr.length) {
        return arr[i++];
      }
    }
  };
}


describe('filter', function () {
  var calls;

  function adds(n) {
    return function () {
      calls.push(n);
    };
  }

  beforeEach(function () {
    calls = [];
  });

  it('throws if called without arguments', function () {
    assert.throws(function () {
      filter();
    }, TypeError);
  });

  it('invokes each function returned by the iterator', function () {
    var it = iterator([adds(1), adds(2)]);

    filter(it);

    assert.deepEqual(calls, [1, 2]);
  });

  it('does not invoke next if filter does not', function () {
    var it = iterator([function (next) {
      /*jslint unparam: true*/
      calls.push(1);
    }, adds(2)]);

    filter(it);

    assert.deepEqual(calls, [1]);
  });

  it('invokes next if filter invokes next', function () {
    var it = iterator([function (next) {
      next();
    }, adds(1)]);

    filter(it);

    assert.deepEqual(calls, [1]);
  });

  it('invokes callback passed to next', function () {
    var it = iterator([function (next) {
      next(adds(1));
    }]);

    filter(it);

    assert.deepEqual(calls, [1]);
  });

  it('does not invoke previous callback if filter does not', function () {
    var it = iterator([function (next) {
      next(adds(1));
    }, function (next, callback) {
      /*jslint unparam: true*/
      next(adds(2));
      // Not invoking callback
    }]);

    filter(it);

    assert.deepEqual(calls, [2]);
  });

  it('does invoke previous callback if filter invokes callback', function () {
    var it = iterator([function (next) {
      next(adds(1));
    }, function (next, callback) {
      next(adds(2));
      callback();
    }]);

    filter(it);

    assert.deepEqual(calls, [2, 1]);
  });

  it('invokes callback for empty iterator', function () {
    var it = iterator([]);

    filter(it, adds(1));

    assert.deepEqual(calls, [1]);
  });

  it('invokes callback for simple filter', function () {
    var it = iterator([adds(1)]);

    filter(it, adds(2));

    assert.deepEqual(calls, [1, 2]);
  });

  it('invokes next filter if one throws', function () {
    var it = iterator([function () {
      throw new Error();
    }, adds(1)]);

    filter(it);

    assert.deepEqual(calls, [1]);
  });

  it('passes thrown error to callback', function () {
    var e;
    var it = iterator([function () {
      throw new Error('oups!');
    }]);

    filter(it, function (err) {
      e = err;
    });

    assert.equal(e.name, 'Error');
    assert.equal(e.message, 'oups!');
  });

  it('invokes next filter if one with next arg throws', function () {
    var it = iterator([function (next) {
      /*jslint unparam: true*/
      throw new Error();
    }, adds(1)]);

    filter(it);

    assert.deepEqual(calls, [1]);
  });

  it('passes thrown error from filter with next arg to callback', function () {
    var e;
    var it = iterator([function (next) {
      /*jslint unparam: true*/
      throw new Error('oups!');
    }]);

    filter(it, function (err) {
      e = err;
    });

    assert.equal(e.name, 'Error');
    assert.equal(e.message, 'oups!');
  });

  it('invokes filter functions with given scope', function () {
    var it = iterator([function (next) {
      calls.push(this);
      next();
    }, function () {
      calls.push(this);
    }]);
    var scope = {};

    filter(it, scope);

    assert.deepEqual(calls, [scope, scope]);
  });

  it('passes callback error back', function () {
    var e = new Error('oups!');
    var it = iterator([function (next) {
      next(function (err) {
        calls.push(err);
      });
    }, function (next, callback) {
      /*jslint unparam: true*/
      callback(e);
    }]);

    filter(it);

    assert.deepEqual(calls, [e]);
  });

  it('passes callback value to previous filter', function () {
    var it = iterator([function (next) {
      next(function (err, value) {
        /*jslint unparam: true*/
        calls.push(value);
      });
    }, function (next, callback) {
      /*jslint unparam: true*/
      callback(null, 'some value');
    }]);

    filter(it);

    assert.deepEqual(calls, ['some value']);
  });

  it('returns callback value from first filter', function () {
    var it = iterator([function (next, callback) {
      next(function () {
        callback(null, 'some value');
      });
    }, function (next) {
      next();
    }]);

    filter(it, function (err, v) {
      /*jslint unparam: true*/
      assert.equal(v, 'some value');
    });
  });

  it('returns callback value from second filter', function () {
    var it = iterator([function (next) {
      next();
    }, function (next, callback) {
      next(function () {
        callback(null, 'some value');
      });
    }]);

    filter(it, function (err, v) {
      /*jslint unparam: true*/
      assert.equal(v, 'some value');
    });
  });

  it('uses 4th argument as callback if 3rd is null', function () {
    var it = iterator([]);

    filter(it, null, null, adds(1));

    assert.deepEqual(calls, [1]);
  });

  it('invokes 2nd argument as last filter', function () {
    var it = iterator([adds(1)]);

    filter(it, adds(2), adds(3));

    assert.deepEqual(calls, [1, 2, 3]);
  });

  it('invokes 3rd argument as last filter', function () {
    var it = iterator([adds(1)]);

    filter(it, null, adds(2), adds(3));

    assert.deepEqual(calls, [1, 2, 3]);
  });

  it('invokes 3rd argument with correct scope', function (done) {
    var it = iterator([]);
    var scope = {};

    filter(it, scope, function () {
      assert.strictEqual(this, scope);
    }, done);
  });

  it('does not invoke done if 2nd agument expects callback', function () {
    var it = iterator([]);

    filter(it, function (callback) {
      /*jslint unparam: true*/
      return;
    }, adds(1));

    assert.deepEqual(calls, []);
  });

  it('passes done function to 2nd argument', function () {
    var it = iterator([]);
    var done = function () {
      return;
    };

    var cb;
    filter(it, function (callback) {
      cb = callback;
    }, done);

    assert.strictEqual(cb, done);
  });

  it('passes done function to 3rd argument with correct scope', function () {
    var it = iterator([]);
    var done = function () {
      return;
    };
    var scope = {};

    var cb;
    var s;
    filter(it, scope, function (callback) {
      cb = callback;
      s = this;
    }, done);

    assert.strictEqual(cb, done);
    assert.strictEqual(s, scope);
  });

  it('invokes callback with error from additional filter', function () {
    var it = iterator([]);
    var e = new Error();

    var error;
    filter(it, function () {
      throw e;
    }, function (err) {
      error = err;
    });

    assert.strictEqual(error, e);
  });

});
