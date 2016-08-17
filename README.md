# parse-css-dimension

[![NPM version](http://img.shields.io/npm/v/parse-css-dimension.svg?style=flat)](https://www.npmjs.org/package/parse-css-dimension)
[![npm license](http://img.shields.io/npm/l/parse-css-dimension.svg?style=flat-square)](https://www.npmjs.org/package/parse-css-dimension)
[![Travis Build Status](https://img.shields.io/travis/jedmao/parse-css-dimension.svg?label=unix)](https://travis-ci.org/jedmao/parse-css-dimension)

[![npm](https://nodei.co/npm/parse-css-dimension.svg?downloads=true)](https://nodei.co/npm/parse-css-dimension/)

Parse a CSS dimension (i.e., [`<number>`](https://developer.mozilla.org/en-US/docs/Web/CSS/number), [`<length>`](https://developer.mozilla.org/en-US/docs/Web/CSS/length), [`<percentage>`](https://developer.mozilla.org/en-US/docs/Web/CSS/percentage), [`<angle>`](https://developer.mozilla.org/en-US/docs/Web/CSS/angle), [`<resolution>`](https://developer.mozilla.org/en-US/docs/Web/CSS/resolution), [`<frequency>`](https://developer.mozilla.org/en-US/docs/Web/CSS/frequency), [`<time>`](https://developer.mozilla.org/en-US/docs/Web/CSS/time)) into a JavaScript object.

## Installation

```
$ npm install parse-css-dimension [--save[-dev]]
```

## Usage

```js
var parseCssDimension = require('parse-css-dimension');
parseCssDimension('-3.4e-2');  // { type: 'number', value: -0.034 }
parseCssDimension('42em');     // { type: 'length', value: 42, unit: 'em' }
parseCssDimension('42deg');    // { type: 'angle', value: 42, unit: 'deg' }
parseCssDimension('42dpi');    // { type: 'resolution', value: 42, unit: 'dpi' }
parseCssDimension('42Hz');     // { type: 'frequency', value: 42, unit: 'Hz' }
parseCssDimension('42ms');     // { type: 'time', value: 42, unit: 'ms' }
parseCssDimension('42%');      // { type: 'percentage', value: 42 }
```

## Testing

```
$ npm test
```

This will run tests and generate a code coverage report. Anything less than 100% coverage will throw an error.
