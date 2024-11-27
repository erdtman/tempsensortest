/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const moment = require('moment-timezone');
moment.tz.setDefault("Europe/Stockholm");
const express = require('express');
const router = express.Router();


let state = false
router.get("/", async (req, res) => {
    res.send(state? "ON": "OFF")
    state = !state;
});


module.exports = router;
