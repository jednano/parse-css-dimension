## 2.0.0
- Convert project from JavaScript into TypeScript.
- **Breaking:** Default export is now the `CssDimension` class.
- **Breaking:** `valueOf` method now returns a string with unit instead of a number w/o unit (same as `toString`). Use `instance.value` if you want the numeric value.
- **New:** static `parse` method returns new instance of `CssDimension`.
- **New:** TypeScript definitions now come included with npm package.

## 1.1.0
- Introduce CssDimension class.
- Support [`<angle>`](https://developer.mozilla.org/en-US/docs/Web/CSS/angle), [`<resolution>`](https://developer.mozilla.org/en-US/docs/Web/CSS/resolution), [`<frequency>`](https://developer.mozilla.org/en-US/docs/Web/CSS/frequency) and [`<time>`](https://developer.mozilla.org/en-US/docs/Web/CSS/time) units ([issue 1](https://github.com/jedmao/parse-css-dimension/issues/1)). Thanks [`@niksy`](https://github.com/niksy)!

## 1.0.1
- Add changelog.
- Update readme.

## 1.0.0
- Initial release.
