# min-filter.js [![Build Status](https://travis-ci.org/mantoni/min-filter.js.png?branch=master)](https://travis-ci.org/mantoni/min-filter.js)

Minimal filter chain for Node.js and the browser

Repository: <https://github.com/mantoni/min-filter.js>

---

## Install with npm

```
npm install min-filter
```

## Browser compatibility

To use this module in a browser, download the npm package and then use
[Browserify](http://browserify.org) to create a standalone version.

## Usage

The filter operates on a [min-iterator][] implementation. This example uses a
[live-list][] to demonstrate the usage:

```js
var filter = require('min-filter');
var List   = require('live-list').List;

var l = new List();
l.push(function (next) {
  // Do stuff before the next thing ...
  next();
});
l.push(function (next, callback) {
  next(function () {
    // Do stuff on the way back ...
    callback();
  });
});

var it = l.iterator();

filter(it, function () {
  // Done.
});
```

## API

- `filter(iterator[, scope][, callback])`

## License

MIT

[min-iterator]: https://github.com/mantoni/min-iterator.js
[live-list]: https://github.com/mantoni/live-list.js
