# Changes

## 1.0.0

- *BREAKING CHANGE*: The given iterator must now return objects
    - The object must have an `fn` property with the function to invoke.
    - The object may have a `scope` property with the scope to invoke the function on.
- Simplify build by using Mochify
- Run tests in real browsers with SauceLabs

## 0.2.0

- Introduce `then` function to invoke after the last filter called `next`

## 0.1.0

- Initial release
