/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const frezer = require('../models/Frezer.js');

const moment = require('moment-timezone');
moment.tz.setDefault("Europe/Stockholm");
const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.render('frezer');
});

router.post('/measurement', async (req, res) => {
  try {
    const temp = await frezer.read();

    if (temp.measurements.length > 1440) {
      temp.measurements.shift();
    }

    const value = {
      raw: req.body.temp,
      time: new Date().getTime()
    };

    temp.measurements.push(value);
    await frezer.write(temp);
    res.send(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }


});

router.get('/measurements', async (_, res) => {
  try {
    const temp = await frezer.read();

    const labels = temp.measurements.filter(value => !Number.isNaN(value.parsed)).map(value => {
      return moment(value.time).format("YYYY-MM-DD HH:mm");
    });

    const dataset = temp.measurements.filter(value => !Number.isNaN(value.parsed)).map(value => {
      return value.raw;
    });

    const latest = temp.measurements.at(-1)

    res.json({
      labels: labels,
      dataset: dataset,
      latest: {
        value: latest.raw,
        time: moment(latest.time).format("YYYY-MM-DD HH:mm")
      }
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


module.exports = router;
