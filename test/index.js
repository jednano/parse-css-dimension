var tape = require('tape');
var cssLengthUnits = require('css-length-units');
var cssAngleUnits = require('css-angle-units');
var cssResolutionUnits = require('css-resolution-units');
var cssFrequencyUnits = require('css-frequency-units');
var cssTimeUnits = require('css-time-units');

var units = [].concat(
	cssAngleUnits,
	cssFrequencyUnits,
	cssLengthUnits,
	cssResolutionUnits,
	cssTimeUnits
);

var parseCssDimension = require('..');

tape('parse-css-dimension', function(t) {

	t.throws(
		function() {
			parseCssDimension('12.');
		},
		/The dot should be followed by a number/,
		'throws when a dot should be followed by a number'
	);

	t.throws(
		function() {
			parseCssDimension('+-12.2');
		},
		/Only one leading \+\/- is allowed/,
		'throws when more than one leading +/- is provided'
	);

	t.throws(
		function() {
			parseCssDimension('12.1.1');
		},
		/Only one dot is allowed/,
		'throws when more than one dot is provided'
	);

	t.throws(
		function() {
			parseCssDimension('12foo');
		},
		/Invalid unit: foo/,
		'throws when an invalid unit of "foo" is provided'
	);

	t.throws(
		function() {
			parseCssDimension('foo42');
		},
		/Invalid number: foo/,
		'throws when an invalid number of "foo42" is provided'
	);

	t.equal(
		parseCssDimension('42%') instanceof parseCssDimension.CssDimension,
		true,
		'creates an instance of CssDimension'
	);

	t.equal(
		parseCssDimension('42%') + 3,
		45,
		'supports adding numbers to the result'
	);

	t.equal(
		parseCssDimension('42%').toString() + 'foo',
		'42%foo',
		'stringifies a percent'
	);

	t.equal(
		parseCssDimension('42').toString() + 'foo',
		'42foo',
		'stringifies a number'
	);

	var validNumbers = {
		     '12': 12,
		   '4.01': 4.01,
		 '-456.8': -456.8,
		    '0.0': 0,
		   '+0.0': 0,
		   '-0.0': 0,
		    '.60': 0.6,
		   '10e3': 10000,
		'-3.4e-2': -0.034
	};

	units.forEach(function(unit) {
		Object.keys(validNumbers).forEach(function(rawNumber) {
			var num = validNumbers[rawNumber];

			var d1 = parseCssDimension(rawNumber);
			var msg = 'parses ' + rawNumber;
			t.equal(d1.type, 'number', msg);
			t.equal(d1.value, num, msg);
			t.equal(d1.unit, undefined, msg);

			var d2 = parseCssDimension(rawNumber + '%');
			msg += '%';
			t.equal(d2.type, 'percentage', msg);
			t.equal(d2.value, num, msg);
			t.equal(d2.unit, '%', msg);
		});
	});

	[
		{
			list: cssLengthUnits,
			'type': 'length'
		},
		{
			list: cssAngleUnits,
			'type': 'angle'
		},
		{
			list: cssResolutionUnits,
			'type': 'resolution'
		},
		{
			list: cssFrequencyUnits,
			'type': 'frequency'
		},
		{
			list: cssTimeUnits,
			'type': 'time'
		}
	].forEach(function(unitDef) {
		unitDef.list.forEach(function(unit) {
			Object.keys(validNumbers).forEach(function(rawNumber) {
				var num = validNumbers[rawNumber];

				var d1 = parseCssDimension(rawNumber + unit);
				var msg = 'parses ' + rawNumber + unit;
				t.equal(d1.type, unitDef.type, msg);
				t.equal(d1.value, num, msg);
				t.equal(d1.unit, unit, msg);
			});
		});
	});

	t.end();
});
