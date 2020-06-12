/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const moment = require('moment-timezone');
moment.tz.setDefault("Europe/Stockholm");
const express = require('express');
const router = express.Router();

router.get('/:mac', async (req, res) => {
  try {
    const mac = req.params.mac;
    const running = req.query.running || "baseline";
    console.log(`mac: ${mac}`);
    console.log(`running: ${running}`);

    res.json({
      update_url: "https://tempsensortest.herokuapp.com/public/device/esp_blink.ino.adafruit.bin",
      env: {
        "timer_path": "/timer/stationsgatan/state_v3",
      },
    });
  } catch (error) {
    console.log(error);
    return res.send("10000"); // Try again in 10 seconds and OFF
  }
});

module.exports = router;
