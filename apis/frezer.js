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
    console.log(req.body.temp);
    const temp = await frezer.read();

    if (temp.measurements.length > 1440) {
      temp.measurements.shift();
    }

    const value = {
      raw: req.body.temp,
      time: new Date().getTime()
    };

    temp.measurements.push(value);
    console.log(temp.measurements);
    await frezer.write(temp)
  } catch (error) {
    console.log("typiskt");
    console.log(error);
  }

  res.send();
});

router.get('/measurements', async (_, res) => {
  const temp = await frezer.read();

  const labels = temp.measurements.filter(value => !Number.isNaN(value.parsed)).map(value => {
    return moment(value.time).format("YYYY-MM-DD HH:mm");
  });

  const dataset = temp.measurements.filter(value => !Number.isNaN(value.parsed)).map(value => {
    return value.raw;
  });

  const latest = temp.measurements.at(-1)

  res.json({
    labels:labels,
    dataset:dataset,
    latest: {
      value: latest.raw,
      time: moment(latest.time).format("YYYY-MM-DD HH:mm")
    }
  });
});


module.exports = router;
