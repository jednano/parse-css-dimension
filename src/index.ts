import fill = require('lodash.fill');
import merge = require('lodash.merge');
import zipObject = require('lodash.zipobject');

const cssLengthUnits: string[] = require('css-length-units');
const cssAngleUnits: string[] = require('css-angle-units');
const cssResolutionUnits: string[] = require('css-resolution-units');
const cssFrequencyUnits: string[] = require('css-frequency-units');
const cssTimeUnits: string[] = require('css-time-units');

const numberPrefixPattern = /^(\+|-)?(\.)?/;

export interface IOptions {
	strict?: boolean;
}

export default class CssDimension {

	public static parse(value: string, options?: IOptions) {
		return new CssDimension(value, options);
	}

	public type: string;
	public value: number;
	public unit: string;

	constructor(value: string, options?: IOptions) {

		this.validateNumber(value);
		this.validateSign(value);
		this.validateDots(value);

		const strict = !!(options && options.strict);

		if (/%$/.test(value)) {
			this.type = 'percentage';
			this.value = tryParseNumber(value.substring(0, value.length - 1), strict);
			this.unit = '%';
			return;
		}

		const unit = parseUnit(value);
		if (!unit) {
			this.type = 'number';
			this.value = tryParseNumber(value, strict);
			return;
		}

		this.type = unitToType(unit);
		this.value = tryParseNumber(value.substr(0, value.length - unit.length), strict);
		this.unit = unit;
	}

	public valueOf() {
		return this.toString();
	}

	public toString() {
		return this.value + (this.unit || '');
	}

	private validateNumber(value: string) {
		if (/\.\D?$/.test(value)) {
			throw new Error('The dot should be followed by a number');
		}
	}

	private validateSign(value: string) {
		if (/^[+-]{2}/.test(value)) {
			throw new Error('Only one leading +/- is allowed');
		}
	}

	private validateDots(value: string) {
		if (countDots(value) > 1) {
			throw new Error('Only one dot is allowed');
		}
	}
}

function countDots(value: string) {
	const m = value.match(/\./g);
	return m ? m.length : 0;
}

function tryParseNumber(value: string, strict: boolean) {
	return strict ? tryParseStrict(value) : tryParseFloat(value);
}

function tryParseFloat(value: string) {
	const result = parseFloat(value);
	if (isNaN(result)) {
		throw new Error('Invalid number: ' + value);
	}
	return result;
}

function normalizeNumber(value: string, allowDot = true) {
	const match = numberPrefixPattern.exec(value);
	if (!match) {
		throw new Error(`Invalid number: ${value}`);
	}
	const [, sign, dot] = match;
	if (sign === '+') {
		value = value.substr(1);
	}
	if (dot) {
		if (!allowDot) {
			throw new Error(`Invalid number (too many dots): ${value}`);
		}
		if (sign === '-') {
			value = '-0' + value.substr(1);
		} else {
			value = '0' + value;
		}
	}
	return (dot || countDots(value))
		? value.replace(/\.?0+$/, '')
		: value;
}

function tryParseStrict(value: string) {
	const nval = normalizeNumber(value);
	const result = parseFloat(nval);
	if (result.toString() !== nval && !verifyZero(value) && !verifyENotation(value)) {
		throw new Error('Invalid number: ' + value);
	}
	return result;
}

function verifyZero(value: string) {
	return parseFloat(value) === 0;
}

function verifyENotation(value: string) {
	const m = /e/i.exec(value);
	if (!m || m.index === value.length - 1) {
		return false;
	}
	try {
		const nval = normalizeNumber(value.substr(m.index + 1), false);
		return parseInt(nval, 10).toString() === nval;
	} catch (err) {
		throw new Error('Invalid number: ' + value);
	}
}

const units = cssAngleUnits.concat(
	cssFrequencyUnits,
	cssLengthUnits,
	cssResolutionUnits,
	cssTimeUnits,
);

function parseUnit(value: string) {
	const m = value.match(/\D+$/);
	const unit = m && m[0];
	if (unit && units.indexOf(unit) === -1) {
		throw new Error('Invalid unit: ' + unit);
	}
	return unit;
}

const unitTypeLookup = merge(
	createLookups(cssAngleUnits, 'angle'),
	createLookups(cssFrequencyUnits, 'frequency'),
	createLookups(cssResolutionUnits, 'resolution'),
	createLookups(cssTimeUnits, 'time'),
);

function createLookups(list: string[], value: string) {
	return zipObject(list, fill(Array(list.length), value));
}

export function unitToType(unit: string) {
	return unitTypeLookup[unit] || 'length';
}
