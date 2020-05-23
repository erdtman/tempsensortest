const test = require('ava');
const axios = require('axios');

const HOST = "localhost";
const PORT = 5000;

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

test.serial('tick is saved', async t => {
	const tick_count = getRandomInt(10000000);
	const postResp = await axios.post(`http://${HOST}:${PORT}/power/tick/test`, {tick_count: tick_count});
	t.is(postResp.status, 201);
	const resp = await axios.get(`http://${HOST}:${PORT}/power/test/raw`);
	t.is(resp.status, 200);
	const found = resp.data.find(element => element.tick_count === tick_count)
	t.truthy(found);
});


test.serial('graph', async t => {
	const resp = await axios.get(`http://${HOST}:${PORT}/power/test/graph`);
	t.is(resp.status, 200);
});

test.serial('period', async t => {
	const resp = await axios.get(`http://${HOST}:${PORT}/power/test/period`);
	t.is(resp.status, 200);
});

test.serial('now', async t => {
	const resp = await axios.get(`http://${HOST}:${PORT}/power/test/now`);
	t.is(resp.status, 200);
});
