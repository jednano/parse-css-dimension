import test from 'ava';

const cssLengthUnits: string[] = require('css-length-units');
const cssAngleUnits: string[] = require('css-angle-units');
const cssResolutionUnits: string[] = require('css-resolution-units');
const cssFrequencyUnits: string[] = require('css-frequency-units');
const cssTimeUnits: string[] = require('css-time-units');

const parseOptions = [, {strict: false}, {strict: true}];

import CssDimension from './';

test('throws when a dot should be followed by a number', (t) => {
	parseOptions.forEach((options) => {
		t.throws(
			() => new CssDimension('12.', options),
			/The dot should be followed by a number/,
		);
	});
});

test('throws when more than one leading +/- is provided', (t) => {
	parseOptions.forEach((options) => {
		t.throws(
			() => new CssDimension('+-12.2', options),
			/Only one leading \+\/- is allowed/,
		);
	});
});

test('throws when more than one dot is provided', (t) => {
	parseOptions.forEach((options) => {
		t.throws(
			() => new CssDimension('12.1.1', options),
			/Only one dot is allowed/,
		);
	});
});

test('throws when an invalid unit of "foo" is provided', (t) => {
	parseOptions.forEach((options) => {
		t.throws(
			() => new CssDimension('12foo', options),
			/Invalid unit: foo/,
		);
	});
});

test('throws in strict mode when an invalid number of "foo42" is provided', (t) => {
	parseOptions.forEach((options) => {
		t.throws(
			() => new CssDimension('foo42', options),
			/Invalid number: foo/,
		);
	});
});

const nonNumbers = [
	'+.NaN%',
	'NaN%',
];

test('throws in when non-number input with "NaN" is provided', (t) => {
	parseOptions.forEach((options) => {
		nonNumbers.forEach((nonNumber) => {
			t.throws(
				() => new CssDimension(nonNumber, options),
				new RegExp('Invalid number: ' + nonNumber.replace('+', '\\+').replace(/%$/, '')),
			);
		});
	});
});

const strictInvalidENotationNumbers = [
	'.23e-a07',
	'23e.07',
	'23e0.7',
	'23e-.07',
	'23e+0.07',
];

test('throws in strict mode when a number with invalid e-notation is provided', (t) => {
	strictInvalidENotationNumbers.forEach((invalidNumber) => {
		t.throws(
			() => new CssDimension(invalidNumber, {strict: true}),
			new RegExp('Invalid number: ' + invalidNumber.replace('+', '\\+')),
		);
	});
});

test('throws in strict when an invalid number of "35sdfs75rem" is provided', (t) => {
	t.throws(
		() => new CssDimension('35sdfs75rem', {strict: true}),
		/Invalid number: 35sdfs75/,
	);
});

test('parse result is instance of CssDimension', (t) => {
	parseOptions.forEach((options) => {
		t.is(
			CssDimension.parse('42%', options) instanceof CssDimension,
			true,
		);
	});
});

test('returns the numeric value with .value', (t) => {
	parseOptions.forEach((options) => {
		t.true(typeof new CssDimension('42%', options).value === 'number');
	});
});

test('adding a number yields a concatenated string', (t) => {
	parseOptions.forEach((options) => {
		t.is(
			(CssDimension.parse('42%', options) as any) + 3,
			'42%3',
		);
	});
});

test('stringifies a percent', (t) => {
	parseOptions.forEach((options) => {
		t.is(
			new CssDimension('42%', options) + 'foo',
			'42%foo',
		);
	});
});

test('stringifies a number', (t) => {
	parseOptions.forEach((options) => {
		t.is(
			new CssDimension('42', options) + 'foo',
			'42foo',
		);
	});
});

const validNumbers = {
	'+0.0': 0,
	'-.1': -0.1,
	'-0.0': -0,
	'-3.4e-2': -0.034,
	'-456.8': -456.8,
	'.60': 0.6,
	'0.0': 0,
	'000289.6800': 289.68,
	'068': 68,
	'10E-3': 0.01,
	'10e3': 10000,
	'12': 12,
	'4.01': 4.01,
	'540': 540,
	'89.3000': 89.3,
};

test('number conversion', (t) => {
	const unit = '%';
	parseOptions.forEach((options) => {
		Object.keys(validNumbers).forEach((rawNumber) => {
			const num = validNumbers[rawNumber];

			const d1 = CssDimension.parse(rawNumber, options);
			let msg = 'parses ' + rawNumber;
			t.is(d1.type, 'number', msg);
			t.is(d1.value, num, msg);
			t.is(d1.unit, undefined, msg);

			const d2 = CssDimension.parse(rawNumber + unit, options);
			msg += unit;
			t.is(d2.type, 'percentage', msg);
			t.is(d2.value, num, msg);
			t.is(d2.unit, unit, msg);
		});
	});
});

test('units and unit types', (t) => {
	[
		{
			list: cssLengthUnits,
			type: 'length',
		},
		{
			list: cssAngleUnits,
			type: 'angle',
		},
		{
			list: cssResolutionUnits,
			type: 'resolution',
		},
		{
			list: cssFrequencyUnits,
			type: 'frequency',
		},
		{
			list: cssTimeUnits,
			type: 'time',
		},
	].forEach((unitDef) => {
		unitDef.list.forEach((unit) => {
			parseOptions.forEach((options) => {
				Object.keys(validNumbers).forEach((rawNumber) => {
					const num = validNumbers[rawNumber];

					const d1 = CssDimension.parse(rawNumber + unit, options);
					const msg = 'parses ' + rawNumber + unit;
					t.is(d1.type, unitDef.type, msg);
					t.is(d1.value, num, msg);
					t.is(d1.unit, unit, msg);
				});
			});
		});
	});
});
