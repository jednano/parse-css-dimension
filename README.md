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

```ts
import CssDimension from 'parse-css-dimension';
CssDimension.parse(value) || new CssDimension(value);
```

### Examples

```ts
CssDimension.parse('-3.4e-2');  // { [Number: -0.034] type: 'number', value: -0.034 }
CssDimension.parse('42em');     // { [Number: 42] type: 'length', value: 42, unit: 'em' }
CssDimension.parse('42deg');    // { [Number: 42] type: 'angle', value: 42, unit: 'deg' }
CssDimension.parse('42dpi');    // { [Number: 42] type: 'resolution', value: 42, unit: 'dpi' }
CssDimension.parse('42Hz');     // { [Number: 42] type: 'frequency', value: 42, unit: 'Hz' }
CssDimension.parse('42ms');     // { [Number: 42] type: 'time', value: 42, unit: 'ms' }
CssDimension.parse('42%');      // { [Number: 42] type: 'percentage', value: 42 }
```

The result is an instance of `CssDimension`, which allows you to stringify it
back into its original form via `.toString()` or perform math calculations.

```ts
const result = CssDimension.parse('42%') || new CssDimension('42%');
result instanceof CssDimension; // true
result.toString(); // 42%
result.valueOf(); // 42
result + 3; // 45
```

## Testing

```
$ npm test
```

This will run tests and generate a code coverage report. Anything less than 100% coverage will throw an error.

```
$ npm run watch
```

You get the idea.
