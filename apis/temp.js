/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const m = require('../models/Measurement.js');
const express = require('express');
const router = express.Router();

router.get('/', async (req, resp) => {
    resp.render('temp');
});



router.get('/:id/now', async (req, res) => {
    try {
        let id = req.params.id ;

        if (!id) {
            return res.status(400).send("missing parameter");
        }

        const value = {
            "now" : await m.now(id),
            "day_min" : await m.min(id, "DAY"),
            "day_max" : await m.max(id, "DAY"),
            "week_min" : await m.min(id, "WEEK"),
            "week_max" : await m.max(id, "WEEK"),
            "month_min" : await m.min(id, "MONTH"),
            "month_max" : await m.max(id, "MONTH"),
        };

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(value));
    } catch (error) {
        console.log(error);
        res.send(500);
    }
});

router.get('/:id/clean', async (req, res) => {
    try {
        let id = req.params.id ;
        if (!id) {
            return res.status(400).send("missing parameter");
        }

        if (id === 'sensor2'){ // Temporary hack
            id = 'outdoor';
        }

        const value = await m.now(id)
        res.send(value.measurement.toFixed(0));
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id ;
        const interval = req.query.interval || "HOUR";

        if (!id) {
            return res.status(400).send("missing parameter");
        }
        const values = await m.listAgregate(id, interval)
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(values));
    } catch (error) {
        console.log(error);
        res.send(500);
    }
});

router.post('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const value = req.body.value;

        if (!id || !value) {
            return res.status(400).send("missing parameter");
        }

        await m.create(id, value)
        res.send(201);
    } catch (errot) {
        console.log(error);
        res.send(500);
    }
});

module.exports = router;
