var cssLengthUnits = require('css-length-units');

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
		'type': 'length',
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
	if (unit && cssLengthUnits.indexOf(unit) === -1) {
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
