/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const t = require('../models/Tick.js');
const moment = require('moment-timezone');
moment.tz.setDefault("Europe/Stockholm");
const express = require('express');
const router = express.Router();

router.post("/tick/:id", async (req, res) => {
    try {
        const id = req.params.id ;
        if (!id) {
            return res.status(400).send("missing parameter");
        }

        if(req.body.tick_count == 0) {
          return res.send();
        }

        const ticks = req.body.tick_count || 1;

        t.create(id, ticks);
        res.send(201);
    } catch (error) {
        console.log(error);
        res.send(500);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id ;
        if (!id) {
            return res.status(400).send("missing parameter");
        }
        const now = moment();
        const data = {
            "hour_consumption" : await t.readLast(id, "HOUR"),
            "day_consumption": await t.readLast(id, "DAY"),
            "month": now.format("MMMM"),
            "month_consumption": await t.readLast(id, "MONTH"),
            "year": now.format("YYYY"),
            "year_consumption": await t.readLast(id, "YEAR")
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data));
    } catch (error) {
        console.log(error);
        res.send(500);
    }
});

router.get("/:id/last", async (req, res) => {
    try {
        const id = req.params.id ;
        const interval = req.query.interval || "HOUR";

        if (!id) {
            return res.status(400).send("missing parameter");
        }

        const value = await t.readLast(id, interval);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(value));
    } catch (error) {
        console.log(error);
        res.send(500);
    }
});

router.get("/:id/raw", async (req, res) => {
    try {
        const id = req.params.id;
        const interval = req.query.interval || "HOUR";
        if (!id) {
            return res.status(400).send("missing parameter");
        }
        const value = t.read(id, interval)
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(value));
    } catch (error) {
        console.log(error);
        res.send(500);
    }
});

module.exports = router;
