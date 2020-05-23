const test = require('ava');
const axios = require('axios');

const HOST = "localhost";
const PORT = 5000;

test.serial('clean endpoint works', async t => {
	const temp = 37.6;
	const postResp = await axios.post(`http://${HOST}:${PORT}/measurement/test`, {value: temp});
	t.is(postResp.status, 201);
	const resp = await axios.get(`http://${HOST}:${PORT}/measurement/test/clean`);
	t.is(resp.status, 200);
	t.is(resp.data, 38);
});

test.serial('now endpoint works', async t => {
	const temp = 22.3;
	const postResp = await axios.post(`http://${HOST}:${PORT}/measurement/test`, {value: temp});
	t.is(postResp.status, 201);
	const resp = await axios.get(`http://${HOST}:${PORT}/measurement/test/now`);
	t.is(resp.status, 200);
	t.is(resp.data.now.measurement_raw, temp);
});

test.serial('slash', async t => {
	const resp = await axios.get(`http://${HOST}:${PORT}/measurement/test/`);
	t.is(resp.status, 200);
});

