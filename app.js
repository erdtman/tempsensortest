/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const m = require('./models/Measurement.js');
const c = require('./models/Config.js');
const Notifier = require('./Notifier.js');
const db = require('./db.js');

//const url = process.env.MONGODB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/my_database_name';
const url = process.env.MONGODB_URI || process.env.MONGOHQ_URL || 'mongodb://local:loca123!@ds023325.mlab.com:23325/heroku_w1wkbjcz';
const port = process.env.PORT || 5000;

app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(Notifier.ticker);

app.set('port', port);
app.set('etag', false);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use('/timer', require('./apis/timer.js'));
app.use('/measurement', require('./apis/temp.js'));
app.use('/power', require('./apis/power.js'));

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
    res.send(500);
  }
});

db.connect(url, (err) => {
  if (err) {
    console.log('Unable to connect to Mongo.');
  } else {
    console.log('Connection established to', url);
    const server = app.listen(port, function() {
      const host = server.address().address;
      const port = server.address().port;
      console.log(`Listening at http://${host}:${port}`);
    });
  }
});
