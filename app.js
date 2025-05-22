/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const c = require('./models/Config.js');
const db = require('./db.js');
const { setup } = require('./utils/Tibber.js');

const url = process.env.MONGODB_URI || process.env.MONGOHQ_URL || process.env.LOCAL_MONGO_URL;
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 5000;

app.use('/public', express.static(__dirname + '/public'));
app.use('/arduino', express.static(__dirname + '/arduino'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(cookieParser());

app.set('port', port);
app.set('etag', false);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use('/switch', require('./apis/switch.js'));
app.use('/timer', require('./apis/timer.js'));
app.use('/measurement', require('./apis/temp.js'));
app.use('/power', require('./apis/power.js'));
app.use('/noice', require('./apis/noice.js'));
app.use('/frezer', require('./apis/frezer.js'));
app.use('/device', require('./apis/device.js'));
app.use('/shotgun', require('./apis/shotgun.js'));

app.get('/config', async (req, resp) => {
  try {
    const config = await c.read();
    resp.render('config', config);
  } catch(error) {
    console.log(error);
    resp.send(500);
  }
});

app.post('/config', async (req, res) => {
  try {
    const config = await c.read();
    config.username = req.body.username || config.username;
    config.password = req.body.password || config.password;
    config.tel = req.body.tel || config.tel;
    await config.save();
    res.redirect('/config');
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


async function start() {
  const err = await db.connect(url)
  if (err) {
    return console.log('Unable to connect to Mongo');
  }
  console.log(`Connected to Mongo: ${url}`);
  await setup();

  app.listen(port, function() {
    console.log(`Listening at http://${host}:${port}`);
  });
}

start();