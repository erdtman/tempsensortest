/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const d = require('../models/Device.js');
const moment = require('moment-timezone');
moment.tz.setDefault("Europe/Stockholm");
const express = require('express');
const router = express.Router();


const bin_map = {
  timer_v2:"https://tempsensortest.herokuapp.com/arduino/timer/timer.ino.adafruit.bin"
};

router.get('/:mac', async (req, res) => {
  try {
    const mac = req.params.mac;
    const running = req.query.running || "baseline";
    console.log(`mac: ${mac}`);
    console.log(`running: ${running}`);

    const device_config = await d.read(mac);
    console.log(device_config);
/*
    if(running === device_config.should_run){
      return res.json({}); // all is fine continue
    }
    console.log("running wrong image");
*/
    //console.log(bin_map[device_config.should_run]);

    res.json({
      action_url: device_config.action_url,
      // update_url: bin_map[device_config.should_run],
    });
  } catch (error) {
    console.log(error);
    return res.send("10000"); // Try again in 10 seconds and OFF
  }
});

router.get('/:mac/read', async function(req, res) {
  try {
    const mac = req.params.mac;
    const device_config = await d.read(mac);
    res.json(device_config);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post('/:mac/write', async function(req, res) {
  try {
    await d.write(req.body);
    res.send();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
