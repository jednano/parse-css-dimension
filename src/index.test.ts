import test from 'ava';

const cssLengthUnits: string[] = require('css-length-units');
const cssAngleUnits: string[] = require('css-angle-units');
const cssResolutionUnits: string[] = require('css-resolution-units');
const cssFrequencyUnits: string[] = require('css-frequency-units');
const cssTimeUnits: string[] = require('css-time-units');

import CssDimension from './';

test('throws when a dot should be followed by a number', (t) => {
	t.throws(
		() => new CssDimension('12.'),
		/The dot should be followed by a number/,
	);
});

test('throws when more than one leading +/- is provided', (t) => {
	t.throws(
		() => new CssDimension('+-12.2'),
		/Only one leading \+\/- is allowed/,
	);
});

test('throws when more than one dot is provided', (t) => {
	t.throws(
		() => new CssDimension('12.1.1'),
		/Only one dot is allowed/,
	);
});

test('throws when an invalid unit of "foo" is provided', (t) => {
	t.throws(
		() => new CssDimension('12foo'),
		/Invalid unit: foo/,
	);
});

test('throws when an invalid number of "foo42" is provided', (t) => {
	t.throws(
		() => new CssDimension('foo42'),
		/Invalid number: foo/,
	);
});

test('parse result is instance of CssDimension', (t) => {
	t.is(
		CssDimension.parse('42%') instanceof CssDimension,
		true,
	);
});

test('returns the numeric value with .value', (t) => {
	t.true(typeof new CssDimension('42%').value === 'number');
});

test('adding a number yields a concatenated string', (t) => {
	t.is(
		(CssDimension.parse('42%') as any) + 3,
		'42%3',
	);
});

test('stringifies a percent', (t) => {
	t.is(
		new CssDimension('42%') + 'foo',
		'42%foo',
	);
});

test('stringifies a number', (t) => {
	t.is(
		new CssDimension('42') + 'foo',
		'42foo',
	);
});

const validNumbers = {
	'+0.0': 0,
	'-0.0': -0,
	'-3.4e-2': -0.034,
	'-456.8': -456.8,
	'.60': 0.6,
	'0.0': 0,
	'10e3': 10000,
	'12': 12,
	'4.01': 4.01,
};

test('number conversion', (t) => {
	const unit = '%';
	Object.keys(validNumbers).forEach((rawNumber) => {
		const num = validNumbers[rawNumber];

		const d1 = CssDimension.parse(rawNumber);
		let msg = 'parses ' + rawNumber;
		t.is(d1.type, 'number', msg);
		t.is(d1.value, num, msg);
		t.is(d1.unit, undefined, msg);

		const d2 = CssDimension.parse(rawNumber + unit);
		msg += unit;
		t.is(d2.type, 'percentage', msg);
		t.is(d2.value, num, msg);
		t.is(d2.unit, unit, msg);
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
			Object.keys(validNumbers).forEach((rawNumber) => {
				const num = validNumbers[rawNumber];

				const d1 = CssDimension.parse(rawNumber + unit);
				const msg = 'parses ' + rawNumber + unit;
				t.is(d1.type, unitDef.type, msg);
				t.is(d1.value, num, msg);
				t.is(d1.unit, unit, msg);
			});
		});
	});
});
