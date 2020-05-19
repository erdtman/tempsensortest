const test = require('ava');
const axios = require('axios');

const HOST = "localhost";
const PORT = 5000;

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

test.serial('tick is saved', async t => {
	const tick_count = getRandomInt(10000000);
	await axios.post(`http://${HOST}:${PORT}/power/tick/test`, {tick_count: tick_count});
	const resp = await axios.get(`http://${HOST}:${PORT}/power/test/raw`);
	const found = resp.data.find(element => element.tick_count === tick_count)
	t.truthy(found);
});
