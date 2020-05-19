const test = require('ava');
const axios = require('axios');

const HOST = "localhost";
const PORT = 5000;

test.serial('clean endpoint works', async t => {
	const temp = 37.6;
	await axios.post(`http://${HOST}:${PORT}/measurement/test`, {value: temp});
	const resp = await axios.get(`http://${HOST}:${PORT}/measurement/test/clean`);
	t.is(resp.data, 38);
});

test.serial('now endpoint works', async t => {
	const temp = 22.3;
	await axios.post(`http://${HOST}:${PORT}/measurement/test`, {value: temp});
	const resp = await axios.get(`http://${HOST}:${PORT}/measurement/test/now`);
	t.is(resp.data.now.measurement_raw, temp);
});