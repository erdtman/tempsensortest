// Uncomment the following line to include tibber-api NPM package instead.
// const TibberFeed = require("tibber-api").TibberFeed;

const { TibberFeed, TibberQuery } = require('tibber-api');

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



exports.getPower = async function() {
    return new Promise(async (resolve, reject) => {
        const tibberQuery = new TibberQuery(config);
        const tibberFeed = new TibberFeed(tibberQuery);

        tibberFeed.on('data', data => {
            tibberFeed.close();
            resolve(data);
            console.log(data);
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
        });
        await tibberFeed.connect();
    });
}




