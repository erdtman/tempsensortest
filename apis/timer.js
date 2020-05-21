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
  return `${hour}_${fullOrHalfPast}`;
}

router.get('/:id/state', async (req, res) => {
  try {
    const id = req.params.id;
    const config = await c.read(id);

    if(config.state === "ON") {
      return res.send("ON");
    }
    if(config.state === "OFF") {
      return res.send("OFF");
    }
    const index = timeIndex();

    if(config.schedule[index]) {
      return res.send("ON");
    } else {
      return res.send("OFF");
    }
  } catch (error) {
    console.log(error);
    return res.send("OFF");
  }
});

router.get('/:id/state_v2', async (req, res) => {
  try {
    const id = req.params.id;
    const config = await c.read(id);

    if(config.state === "ON") {
      return res.json({"state": "ON", "wait": 60000});
    }
    if(config.state === "OFF") {
      return res.json({"state": "OFF", "wait": 60000});
    }
    const index = timeIndex();

    if(config.schedule[index]) {
      return res.json({"state": "ON", "wait": 60000});
    } else {
      return res.json({"state": "OFF", "wait": 60000});
    }
  } catch (error) {
    console.log(error);
    return res.send("OFF");
  }
});

router.get('/:id/', (req, res) => {
  res.render('timer');
});

router.get('/:id/read', async function(req, res) {
  try {
    const id = req.params.id;
    const config = await c.read(id);

    res.json(config);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post('/:id/write', async function(req, res) {
  try {
    await c.write(req.body);
    res.send();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
