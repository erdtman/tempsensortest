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

const getTimerStateObject = (state, wait) => {
  return {
    "state": state || "OFF",
    "wait": wait || 10000
  }
}

router.get('/:id/state_v2', async (req, res) => {
  try {
    const id = req.params.id;
    const config = await c.read(id);

    const wait = config.training ? 3000 : 60000;

    if(config.state === "ON") {
      return res.json(getTimerStateObject("ON", wait));
    }
    if(config.state === "OFF") {
      return res.json(getTimerStateObject("OFF", wait));
    }
    const index = timeIndex();

    if(config.schedule[index]) {
      return res.json(getTimerStateObject("ON", wait));
    } else {
      return res.json(getTimerStateObject("OFF", wait));
    }
  } catch (error) {
    console.log(error);
    return res.json(getTimerStateObject());
  }
});

router.get('/:id/state_v3', async (req, res) => {
  try {
    const id = req.params.id;
    const config = await c.read(id);

    const wait = config.training ? 3000 : 60000;
    const index = timeIndex();

    if(config.state === "OFF") {
      res.send(`${wait}`); // evern for OFF
    } else if(config.state === "ON") {
      res.send(`${wait + 1}`); // odd for ON :)
    } else if (config.schedule[index]) {
      res.send(`${wait + 1}`); // odd for ON :)
    } else {
      res.send(`${wait}`); // evern for OFF
    }
  } catch (error) {
    console.log(error);
    return res.send("10000"); // Try again in 10 seconds and OFF
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
