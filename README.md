# min-filter.js

[![Build Status]](https://travis-ci.org/mantoni/min-filter.js)
[![SemVer]](http://semver.org)
[![License]](https://github.com/mantoni/min-filter.js/blob/master/LICENSE)

Minimal filter chain for Node.js and the browser

## Install with npm

```
npm install min-filter
```

## Usage

The filter operates on a [min-iterator][] implementation. This example uses a
[live-list][] to demonstrate the usage:

```js
var filter = require('min-filter');
var List   = require('live-list').List;

var l = new List();
l.push({
  fn: function (next) {
    // Do stuff before the next thing ...
    next();
  }
});
l.push({
  fn: function (next, callback) {
    next(function () {
      // Do stuff on the way back ...
      callback();
    });
  },
  scope: this
});

var it = l.iterator();

filter(it, function (err, value) {
  // Done.
});
```

## API

`filter(iterator[, scope][[, then], callback])`

- `iterator`: [min-iterator][] that returns objects with filter functions
- `scope`: The object to use as `this` in each filter function, if not
  specified otherwise
- `then`: A function that is invoked after the last filter called `next`.
  Receives an optional callback argument. If a callback is given, it triggers
  execution of the functions passed to `next` by the filters.
- `callback`: A function that is invoked after all processing of all filters,
  the done function and all callbacks has finished. Receives an error object as
  the first argument and any additional arguments passed back by the callbacks.

Data structure of objects returns by iterator:

- `fn`: The filter function
- `scope`: The scope to use when invoking the filter function. This overrides
  the scope passed to `filter`.

Valid argument combinations:

- `filter(it, callback)`: Invokes filters, then `callback`
- `filter(it, then, callback)`: Invokes filters, calls `then` after last
  filter called `next`, then invokes `callback`
- `filter(it, scope, callback)`: Invokes filters with given scope, then invokes
  `callback`
- `filter(it, scope, then, callback)`: Invokes filters with given scope, calls
  `then` after last filter called `next`, then invokes `callback`

## Browser compatibility

To use this module in a browser, download the npm package and then use
[Browserify](http://browserify.org) to create a standalone version.

## License

MIT

[Build Status]: http://img.shields.io/travis/mantoni/min-filter.js.svg
[SemVer]: http://img.shields.io/:semver-%E2%9C%93-brightgreen.svg
[License]: http://img.shields.io/npm/l/min-filter.svg
[min-iterator]: https://github.com/mantoni/min-iterator.js
[live-list]: https://github.com/mantoni/live-list.js
