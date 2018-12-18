# parcel-plugin-tslint [![NPM version shield][npm-image]][npm-url]

A [Parcel](https://parceljs.org/) plugin for running [tslint][tslint-url].

![Screenshot showing parcel-plugin-tslint output](/docs/screenshot.png?raw=true)

# Install

```bash
# Ensure that you have peer dependencies installed first...
npm install --save parcel-bundler typescript tslint

# ...then install the plugin.
npm install --save-dev parcel-plugin-tslint
```

# Usage

Create a `tslint.json` file, per the tslint configuration [docs][tslint-cfg-url]. You can customize how the linter output is displayed by adding a custom `formatter` setting to the `linterOptions` property. Example:

```
"linterOptions": {
    // See https://palantir.github.io/tslint/formatters/ for full list of formatters
    "formatter": "stylish"
}
```

To disable linting (e.g., while making a production bundle) run with the `DISABLE_PARCEL_TSLINT_PLUGIN` environment variable. Example:

```
// package.json
...
"script" {
  "bundle": "DISABLE_PARCEL_TSLINT_PLUGIN=true parcel build src/index.html"
}
```

# Example

Clone this repo and run `npm run testWatch` or see the whole thing in action *in your browser* here: https://codesandbox.io/s/1ryv0o467

# Release Notes

  - 0.0.1 WIP

## Dependencies

*Regular*

  - `strip-json-comments` makes it easier to parse `tslint.json` (which can have comments).

*Peer*

`parcel-plugin-tslint` assumes that you're already bringing the following to the party:

  - `parcel-bundler` 1.x (tested with 1.10)
  - `tslint` 5.x (tested with 5.11)
  - `typescript`

*Dev*

  - `@types/node` allowed IDEs such as VSCode to be aware of Node's API (i.e., to support "intellisense" features for core Node objects such as 'fs').

# Contributing

See [CONTRIBUTING](./CONTRIBUTING.md)

# Credits
  - tslint[tslint-url] is doing the _real_ work here.
  - [Parcel](https://parceljs.org/)




## TODO

  - Add a mocha test that uses the bundler output checker
  - Add to https://github.com/parcel-bundler/awesome-parcel
  - Mention in https://github.com/fathyb/parcel-plugin-typescript/issues/51#issuecomment-407219283
  - Do a better job of detecting and reporting error if/when tslint depdendency can't be found. Exmple output:
    ```
      $ npm run serve

    > unstated-counter@0.0.1 serve /Users/c/projects/@clinthharris/unstated-counter
    > parcel --no-cache --no-autoinstall -p 1234 src/index.html

    Server running at http://localhost:1234
    🚨  /Users/c/projects/@clinthharris/unstated-counter/src/index.tsx: Cannot resolve dependency './state/CounterState' at '/Users/c/projects/@clinthharris/unstated-counter/src/state/CounterState'
        at Function.Module._resolveFilename (module.js:548:15)
        at Function.Module._load (module.js:475:25)
        at Module.require (module.js:597:17)
        at require (/Users/c/projects/@clinthharris/unstated-counter/node_modules/v8-compile-cache/v8-compile-cache.js:159:20)
        at Object.<anonymous> (/Users/c/projects/@clinthharris/unstated-counter/node_modules/parcel-plugin-tslint/src/TslintAsset.js:2:16)
    ```

    The error says `Cannot resolve dependency './state/CounterState'` but it's _actually_ coming from `TslintAsset.js:2:16` which is `require('tslint');`


[npm-image]: https://img.shields.io/npm/v/parcel-plugin-tslint.svg
[npm-url]: https://npmjs.org/package/parcel-plugin-tslint
[tslint-url]: https://palantir.github.io/tslint/
[tslint-cfg-url]: https://palantir.github.io/tslint/usage/configuration/