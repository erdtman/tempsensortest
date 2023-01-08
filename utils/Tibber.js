// Uncomment the following line to include tibber-api NPM package instead.
// const TibberFeed = require("tibber-api").TibberFeed;

const { TibberFeed, TibberQuery } = require('tibber-api');
const moment = require('moment-timezone');
moment.tz.setDefault("Europe/Stockholm");

// Config object needed when instantiating TibberQuery
const config = {
    active: true,
    apiEndpoint: {
        apiKey: process.env.TIBBER_API_KEY,
        queryUrl: 'https://api.tibber.com/v1-beta/gql',
    },
    homeId: '03170558-a0e5-40ea-8ff0-c7e48d03744d',
    power: true,
};

let latest_value = 1339;
let latest_time = false;


exports.setup = async function () {

    const tibberQuery = new TibberQuery(config);
    const tibberFeed = new TibberFeed(tibberQuery);
    tibberFeed.on('data', data => {
        console.log(data);
        latest_time = moment();
        latest_value = data.power;
    });

    tibberFeed.on('connecting', data => {
        console.log(data);
    });

    tibberFeed.on('connected', data => {
        console.log(data);
    });

    tibberFeed.on('disconnecting', data => {
        console.log(data);
    });

    tibberFeed.on('disconnected', data => {
        console.log(data);
        resolve(value);
    });
    await tibberFeed.connect();
}



exports.getPower = function () {
    if (!latest_time) {
        return 1337;
    }
    const now = moment();
    const almost_now = now.subtract(5, 'minutes');
    if (almost_now.isAfter(latest_time)) {
        return 1338;
    }
    return latest_value;
}




