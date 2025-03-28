/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const t = require('../models/Tick.js');
const { getPower } = require('../utils/Tibber.js');
const moment = require('moment-timezone');
moment.tz.setDefault("Europe/Stockholm");
const express = require('express');
const router = express.Router();


router.post("/dump", async (req, res) => {
  try {
      console.log(req.body.data);
      res.sendStatus(200);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});


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
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/", async (req, res) => {
    res.render('power');
});

router.get("/:id/now", async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).send("missing parameter");
        }

        const data = {
            "now": (await t.readLast(id, '5_MIN', 12)).toFixed(3)
        }

        res.json(data);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/:id/now/clean", async (req, res) => {
  try {
      const id = req.params.id;
      if (!id) {
          return res.status(400).send("missing parameter");
      }

      const power = await getPower();
      console.log(`power now: ${power}`);
      res.send('' + power);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});

const sweDay = {
    "Sunday":     "Söndag",
    "Saturday":   "Lördag",
    "Friday":     "Fredag",
    "Thursday":   "Torsdag",
    "Wednesday":  "Onsdag",
    "Tuesday":    "Tisdag",
    "Monday":     "Måndag"
  }

  const sweMonth = {
    "January":    "January",
    "February":   "Februari",
    "March":      "Mars",
    "April":      "April",
    "May":        "Maj",
    "June":       "Juni",
    "July":       "Juli",
    "August":     "Augusti",
    "September":  "September",
    "October":    "Oktober",
    "November":   "November",
    "December":   "December"
  }

  const title = {
    DAY(date, lookback) {
      return lookback === 0 ? `Idag` : sweDay[date.format("dddd")];
    },
    MONTH(date) {
      return sweMonth[date.format('MMMM')];
    },
    YEAR(date) {
      return date.format('YYYY')
    }
  }

const lookback_unit = {
    DAY: 'days',
    MONTH: 'months',
    YEAR: 'years',
}

router.get('/:id/period', async (req, res) => {
    const lookback = Number(req.query.lookback || 0);
    const interval = req.query.interval || "DAY";
    const id = req.params.id ;
    if (!id) {
        return res.status(400).send("missing parameter");
    }

    if(!title[interval] || !lookback_unit[interval]) {
        throw new Error(`Unhandeled intervall ${interval}`);
      }

    const date = moment().subtract(lookback, lookback_unit[interval]);

    const peak = await t.readPeriodMax(id, interval, date);
    const total = await t.readPeriod(id, interval, date);

    const data = {
        total: total.toFixed(3),
        peak: peak.kw.toFixed(3),
        peak_time: peak.time,
        title: title[interval](date, lookback)
    };

    res.json(data);
});


router.get('/:id/graph', async (req, res) => {
    const lookback = Number(req.query.lookback || 0);
    const interval = req.query.interval || "DAY";
    const id = req.params.id;

    if (!id) {
      throw new Error({ code: 400, message: 'Missing id parameter' });
    }

    if(!title[interval] || !lookback_unit[interval]) {
      throw new Error(`Unhandeled intervall ${interval}`);
    }

    const date = moment().subtract(lookback, lookback_unit[interval]);
    const history = await t.history(id, interval, date);

    res.json({
      label: title[interval](date, lookback),
      history: history
    });
  });



router.get("/:id/raw", async (req, res) => {
    try {
        const id = req.params.id;
        const interval = req.query.interval || "HOUR";
        if (!id) {
            return res.status(400).send("missing parameter");
        }
        const value = await t.read(id, interval)
        res.json(value);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;
