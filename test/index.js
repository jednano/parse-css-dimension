var tape = require('tape');
var cssLengthUnits = require('css-length-units');

var parseCssDimension = require('..');

tape('parse-css-unit', function(t) {

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

	cssLengthUnits.forEach(function(unit) {
		Object.keys(validNumbers).forEach(function(rawNumber) {
			var num = validNumbers[rawNumber];

			t.deepEqual(
				parseCssDimension(rawNumber),
				{
					'type': 'number',
					value: num
				},
				'parses ' + rawNumber
			);

			t.deepEqual(
				parseCssDimension(rawNumber + '%'),
				{
					'type': 'percentage',
					value: num
				},
				'parses ' + rawNumber + '%'
			);

			t.deepEqual(
				parseCssDimension(rawNumber + unit),
				{
					'type': 'length',
					value: num,
					unit: unit
				},
				'parses ' + rawNumber + unit
			);
		});
	});

	t.end();
});
