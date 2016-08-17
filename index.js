var fill = require('lodash.fill');
var merge = require('lodash.merge');
var zipObject = require('lodash.zipobject');
var cssLengthUnits = require('css-length-units');
var cssAngleUnits = require('css-angle-units');
var cssResolutionUnits = require('css-resolution-units');
var cssFrequencyUnits = require('css-frequency-units');
var cssTimeUnits = require('css-time-units');

var units = [].concat(cssLengthUnits, cssAngleUnits, cssResolutionUnits, cssFrequencyUnits, cssTimeUnits);
var unitTypeLookup = merge(
    createLookups(cssAngleUnits, 'angle'),
    createLookups(cssResolutionUnits, 'resolution'),
    createLookups(cssFrequencyUnits, 'frequency'),
    createLookups(cssTimeUnits, 'time')
);

module.exports = function(value) {

	if (/\.\D?$/.test(value)) {
		throw new Error('The dot should be followed by a number');
	}

	if (/^[+-]{2}/.test(value)) {
		throw new Error('Only one leading +/- is allowed');
	}

	if (countDots(value) > 1) {
		throw new Error('Only one dot is allowed');
	}

	if (/%$/.test(value)) {
		return {
			'type': 'percentage',
			value: tryParseFloat(value)
		};
	}

	var unit = parseUnit(value);
	if (!unit) {
		return {
			'type': 'number',
			value: tryParseFloat(value)
		};
	}

	return {
		'type': getTypeFromUnit(unit),
		value: tryParseFloat(value.substr(0, value.length - unit.length)),
		unit: unit
	};
};

function countDots(value) {
	var m = value.match(/\./g);
	return m ? m.length : 0;
}

function parseUnit(value) {
	var m = value.match(/\D+$/);
	var unit = m && m[0];
	if (unit && units.indexOf(unit) === -1) {
		throw new Error('Invalid unit: ' + unit);
	}
	return unit;
}

function tryParseFloat(value) {
	var result = parseFloat(value);
	if (isNaN(result)) {
		throw new Error('Invalid number: ' + value);
	}
	return result;
}

function createLookups(list, value) {
    return zipObject(list, fill(Array(list.length), value));
}

function getTypeFromUnit(unit) {
    return unitTypeLookup[unit] || 'length';
}
