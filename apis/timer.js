/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const c = require('../models/Config.js');
const moment = require('moment-timezone');
moment.tz.setDefault("Europe/Stockholm");
const express = require('express');
const router = express.Router();

const timeIndex = () => {
  const now = moment().tz("Europe/Stockholm");
  const hour = now.format("HH");
  const minute = parseInt(now.format("mm"), 10);
  const fullOrHalfPast = minute >= 30 ? "5" : "0";
  return `${hour}.${fullOrHalfPast}`;
}

router.get('/', async (req, res) => {
  try {
    const config = await c.read();
    if(config.timer_state_v2.state === "ON") {
      return res.send("ON");
    }
    if(config.timer_state_v2.state === "OFF") {
      return res.send("OFF");
    }
    const index = timeIndex();

    if(config.timer_state_v2.schedule[index]) {
      return res.send("ON");
    } else {
      return res.send("OFF");
    }
  } catch (error) {
    console.log(error);
    return res.send("OFF");
  }
});

router.get('/settings/', (req, res) => {
  res.render('timer');
});

router.get('/settings/read', async function(req, res) {
  try {
    const config = await c.read();
    res.send(config.timer_state_v2);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/settings/save', async function(req, res) {
  try {
    const config = await c.read();
    config.timer_state_v2 = req.body;
    await config.save(); // Just wait for the sake of it
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
