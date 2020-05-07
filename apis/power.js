/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const t = require('../models/Tick.js');
const moment = require('moment');
const express = require('express');
const router = express.Router();

router.post("/tick/:id", async (req, res) => {
    try {
        const id = req.params.id ;
        if (!id) {
            return res.status(400).send("missing parameter");
        }
        await t.create(id);
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
            "day_consumption": await t.readLast(id,"DAY"),
            "month": now.format("MMMM"),
            "month_consumption": await t.readLast(id,"MONTH"),
            "year": now.format("YYYY"),
            "year_consumption": await t.readLast(id,"YEAR")
        }

    } catch (error) {
        console.log(error);
        res.send(500);
    }
});

router.get("/last/:id", async (req, res) => {
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

router.get("/graph/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const interval = req.query.interval || "HOUR";
        if (!id) {
            return res.status(400).send("missing parameter");
        }
        const value = t.history(id, interval)
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(value));
    } catch (error) {
        console.log(error);
        res.send(500);
    }
});

router.get("/graph2/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const interval = req.query.interval || "HOUR";
        if (!id) {
            return res.status(400).send("missing parameter");
        }
        console.log("power id: " + id);

        const value = t.history2(id, interval)
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(value, null, 2));

    } catch (error) {
        console.log(error);
        res.send(500);
    }
});

module.exports = router;
