/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const t = require('../models/Tick.js');
const moment = require('moment-timezone');
moment.tz.setDefault("Europe/Stockholm");
const express = require('express');
const router = express.Router();



router.post("/value/:id", async (req, res) => {
    try {
        const id = req.params.id ;
        if (!id) {
            return res.status(400).send("missing parameter");
        }
        const noice = req.body.noice;

        console.log(`noice level in ${id}: ${noice}`);

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});


module.exports = router;
