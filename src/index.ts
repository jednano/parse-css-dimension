import fill = require('lodash.fill');
import merge = require('lodash.merge');
import zipObject = require('lodash.zipobject');

const cssLengthUnits: string[] = require('css-length-units');
const cssAngleUnits: string[] = require('css-angle-units');
const cssResolutionUnits: string[] = require('css-resolution-units');
const cssFrequencyUnits: string[] = require('css-frequency-units');
const cssTimeUnits: string[] = require('css-time-units');

export default class CssDimension {

	public static parse(value: string) {
		return new CssDimension(value) as CssDimension & number;
	}

	public type: string;
	public value: number;
	public unit: string;

	constructor(value: string) {
		this.validateNumber(value);
		this.validateSign(value);
		this.validateDots(value);

		if (/%$/.test(value)) {
			this.type = 'percentage';
			this.value = tryParseFloat(value);
			this.unit = '%';
			return;
		}

		const unit = parseUnit(value);
		if (!unit) {
			this.type = 'number';
			this.value = tryParseFloat(value);
			return;
		}

		this.type = unitToType(unit);
		this.value = tryParseFloat(value.substr(0, value.length - unit.length));
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

function tryParseFloat(value: string) {
	const result = parseFloat(value);
	if (isNaN(result)) {
		throw new Error('Invalid number: ' + value);
	}
	return result;
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
