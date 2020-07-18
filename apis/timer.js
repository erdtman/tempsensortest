/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const c = require('../models/Config.js');
const d = require('../models/Device.js');
const moment = require('moment-timezone');
moment.tz.setDefault("Europe/Stockholm");
const express = require('express');
const router = express.Router();
const shortid = require('shortid');

const timeIndex = () => {
  const now = moment();
  const hour = now.format("HH");
  const minute = parseInt(now.format("mm"), 10);
  const fullOrHalfPast = minute >= 30 ? "5" : "0";
  return `${hour}_${fullOrHalfPast}`;
}


router.get('/', (req, res) => {
  res.render('timer_create');
});

router.post('/', async (req, res) => {
  try {
    const id = shortid.generate();
    const config = await c.read(id);
    config.mac = req.body.mac || "AA:BB:CC:DD:EE:FF";
    await c.write(req.body);

    const device = await d.read(config.mac);
    device.action_url = `https://tempsensortest.herokuapp.com/timer/${id}/state_v3`;
    device.should_run = "timer_v3";
    d.write(device);

    res.redirect(`${id}/`);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get('/:id/', (req, res) => {
  res.render('timer');
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
