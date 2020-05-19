const test = require('ava');
const axios = require('axios');
const config = require('../models/config.js')

const HOST = "localhost";
const PORT = 5000;

test.before(async t => {
	const initial_config = config.getDefaultConfig();
	initial_config._id = "test"
	await axios.post(`http://${HOST}:${PORT}/timer/test/write`, initial_config, { headers: { 'Content-Type': 'application/json' } });
});

test.serial('State ON', async t => {
	const on_config = config.getDefaultConfig();
	on_config._id = "test"
	on_config.state = "ON";
	await axios.post(`http://${HOST}:${PORT}/timer/test/write`, on_config, { headers: { 'Content-Type': 'application/json' } });
	const resp = await axios.get(`http://${HOST}:${PORT}/timer/test/state`);
	t.is(resp.data, 'ON');
});

test.serial('State OFF', async t => {
	const off_config = config.getDefaultConfig();
	off_config._id = "test"
	off_config.state = "OFF";
	await axios.post(`http://${HOST}:${PORT}/timer/test/write`, off_config, { headers: { 'Content-Type': 'application/json' } });
	const resp = await axios.get(`http://${HOST}:${PORT}/timer/test/state`);
	t.is(resp.data, 'OFF');
});

test.serial('Timer state OFF', async t => {
	const resp = await axios.get(`http://${HOST}:${PORT}/timer/test/state`);
	t.is(resp.data, 'OFF');
});

test.serial('Timer state ON', async t => {
	const timer_on_state = {
		"state": "TIMER",
		"_id": "test",
		"schedule": {
			"0_0": true,
			"0_5": true,
			"1_0": true,
			"6_0": true,
			"11_5": true,
			"11_0": true,
			"10_5": true,
			"10_0": true,
			"9_5": true,
			"9_0": true,
			"8_5": true,
			"8_0": true,
			"7_5": true,
			"7_0": true,
			"6_5": true,
			"5_5": true,
			"5_0": true,
			"4_5": true,
			"4_0": true,
			"3_5": true,
			"3_0": true,
			"2_5": true,
			"2_0": true,
			"1_5": true,
			"13_0": true,
			"13_5": true,
			"14_0": true,
			"14_5": true,
			"15_0": true,
			"15_5": true,
			"16_0": true,
			"16_5": true,
			"17_0": true,
			"17_5": true,
			"18_0": true,
			"18_5": true,
			"19_0": true,
			"20_0": true,
			"19_5": true,
			"20_5": true,
			"21_0": true,
			"21_5": true,
			"22_0": true,
			"22_5": true,
			"23_0": true,
			"23_5": true,
			"12_0": true,
			"12_5": true
		}
	}
	await axios.post(`http://${HOST}:${PORT}/timer/test/write`, timer_on_state, { headers: { 'Content-Type': 'application/json' } });
	const resp = await axios.get(`http://${HOST}:${PORT}/timer/test/state`);
	t.is(resp.data, 'ON');
});