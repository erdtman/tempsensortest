/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const m = require('../models/Measurement.js');
const express = require('express');
const router = express.Router();

router.get('/', async (req, resp) => {
    const id = "outdoor"; // TODO change this hardcoded value

    try {
        const value = await m.now(id)
        value.measurement = value.measurement.toFixed(1);
        resp.render('temp', value);
    } catch (error) {
        console.log(error);
        resp.render('index', {
        "id" : "",
        "measurement" : "",
        "time": ""
        });
    }
});

router.get('/:id/now', async (req, res) => {
    try {
        let id = req.params.id ;

        if (!id) {
            return res.status(400).send("missing parameter");
        }

        if (id === 'sensor2'){ // Temporary hack
            id = 'outdoor';
        }

        const value = await m.now(id);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(value));
    } catch (error) {
        console.log(error);
        res.send(500);
    }
});

router.get('/:id/clean', async (req, res) => {
    try {
        const id = req.params.id ;
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
