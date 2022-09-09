/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const temp = require('../models/Temp.js');
const express = require('express');
const router = express.Router();

router.get('/', async (req, resp) => {
    resp.render('temp');
});


router.get('/:id/clean', async (req, res) => {
    try {
        let id = req.params.id ;
        if (!id) {
            return res.status(400).send("missing parameter");
        }

        if (id === 'sensor2') { // Not very temporary hack
            id = 'outdoor';
        }

        const data = await temp.read(id);
        const latest = data.measurements.at(-1)
        res.send(Number(latest.raw).toFixed(0));
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});


router.post('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const rawValue = req.body.value;

        if (!id || !rawValue) {
            return res.status(400).send("missing parameter");
        }

        const data = await temp.read(id);

        if (data.measurements.length > 1440) {
            data.measurements.shift();
        }

        const value = {
            raw: rawValue,
            time: new Date().getTime()
        };

        data.measurements.push(value);

        await temp.write(data, id);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});


module.exports = router;
