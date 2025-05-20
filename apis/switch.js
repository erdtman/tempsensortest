/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const moment = require('moment-timezone');
moment.tz.setDefault("Europe/Stockholm");
const express = require('express');
const router = express.Router();

// Aktuella priser
// Aktuell tid
// När nya priser släpps
let prices = {}

const today = [
  {
      "SEK_per_kWh": 0.43806,
      "EUR_per_kWh": 0.03802,
      "EXR": 11.52178,
      "time_start": "2024-11-27T00:00:00+01:00",
      "time_end": "2024-11-27T01:00:00+01:00"
  },
  {
      "SEK_per_kWh": 0.42147,
      "EUR_per_kWh": 0.03658,
      "EXR": 11.52178,
      "time_start": "2024-11-27T01:00:00+01:00",
      "time_end": "2024-11-27T02:00:00+01:00"
  },
  {
      "SEK_per_kWh": 0.42849,
      "EUR_per_kWh": 0.03719,
      "EXR": 11.52178,
      "time_start": "2024-11-27T02:00:00+01:00",
      "time_end": "2024-11-27T03:00:00+01:00"
  },
  {
      "SEK_per_kWh": 0.44693,
      "EUR_per_kWh": 0.03879,
      "EXR": 11.52178,
      "time_start": "2024-11-27T03:00:00+01:00",
      "time_end": "2024-11-27T04:00:00+01:00"
  },
  {
      "SEK_per_kWh": 0.48334,
      "EUR_per_kWh": 0.04195,
      "EXR": 11.52178,
      "time_start": "2024-11-27T04:00:00+01:00",
      "time_end": "2024-11-27T05:00:00+01:00"
  },
  {
      "SEK_per_kWh": 0.54233,
      "EUR_per_kWh": 0.04707,
      "EXR": 11.52178,
      "time_start": "2024-11-27T05:00:00+01:00",
      "time_end": "2024-11-27T06:00:00+01:00"
  },
  {
      "SEK_per_kWh": 0.72841,
      "EUR_per_kWh": 0.06322,
      "EXR": 11.52178,
      "time_start": "2024-11-27T06:00:00+01:00",
      "time_end": "2024-11-27T07:00:00+01:00"
  },
  {
      "SEK_per_kWh": 1.61224,
      "EUR_per_kWh": 0.13993,
      "EXR": 11.52178,
      "time_start": "2024-11-27T07:00:00+01:00",
      "time_end": "2024-11-27T08:00:00+01:00"
  },
  {
      "SEK_per_kWh": 1.85478,
      "EUR_per_kWh": 0.16098,
      "EXR": 11.52178,
      "time_start": "2024-11-27T08:00:00+01:00",
      "time_end": "2024-11-27T09:00:00+01:00"
  },
  {
      "SEK_per_kWh": 1.72804,
      "EUR_per_kWh": 0.14998,
      "EXR": 11.52178,
      "time_start": "2024-11-27T09:00:00+01:00",
      "time_end": "2024-11-27T10:00:00+01:00"
  },
  {
      "SEK_per_kWh": 1.60591,
      "EUR_per_kWh": 0.13938,
      "EXR": 11.52178,
      "time_start": "2024-11-27T10:00:00+01:00",
      "time_end": "2024-11-27T11:00:00+01:00"
  },
  {
      "SEK_per_kWh": 1.60487,
      "EUR_per_kWh": 0.13929,
      "EXR": 11.52178,
      "time_start": "2024-11-27T11:00:00+01:00",
      "time_end": "2024-11-27T12:00:00+01:00"
  },
  {
      "SEK_per_kWh": 1.58736,
      "EUR_per_kWh": 0.13777,
      "EXR": 11.52178,
      "time_start": "2024-11-27T12:00:00+01:00",
      "time_end": "2024-11-27T13:00:00+01:00"
  },
  {
      "SEK_per_kWh": 1.52894,
      "EUR_per_kWh": 0.1327,
      "EXR": 11.52178,
      "time_start": "2024-11-27T13:00:00+01:00",
      "time_end": "2024-11-27T14:00:00+01:00"
  },
  {
      "SEK_per_kWh": 1.42778,
      "EUR_per_kWh": 0.12392,
      "EXR": 11.52178,
      "time_start": "2024-11-27T14:00:00+01:00",
      "time_end": "2024-11-27T15:00:00+01:00"
  },
  {
      "SEK_per_kWh": 1.44967,
      "EUR_per_kWh": 0.12582,
      "EXR": 11.52178,
      "time_start": "2024-11-27T15:00:00+01:00",
      "time_end": "2024-11-27T16:00:00+01:00"
  },
  {
      "SEK_per_kWh": 1.31786,
      "EUR_per_kWh": 0.11438,
      "EXR": 11.52178,
      "time_start": "2024-11-27T16:00:00+01:00",
      "time_end": "2024-11-27T17:00:00+01:00"
  },
  {
      "SEK_per_kWh": 1.31671,
      "EUR_per_kWh": 0.11428,
      "EXR": 11.52178,
      "time_start": "2024-11-27T17:00:00+01:00",
      "time_end": "2024-11-27T18:00:00+01:00"
  },
  {
      "SEK_per_kWh": 1.32996,
      "EUR_per_kWh": 0.11543,
      "EXR": 11.52178,
      "time_start": "2024-11-27T18:00:00+01:00",
      "time_end": "2024-11-27T19:00:00+01:00"
  },
  {
      "SEK_per_kWh": 1.19907,
      "EUR_per_kWh": 0.10407,
      "EXR": 11.52178,
      "time_start": "2024-11-27T19:00:00+01:00",
      "time_end": "2024-11-27T20:00:00+01:00"
  },
  {
      "SEK_per_kWh": 0.91829,
      "EUR_per_kWh": 0.0797,
      "EXR": 11.52178,
      "time_start": "2024-11-27T20:00:00+01:00",
      "time_end": "2024-11-27T21:00:00+01:00"
  },
  {
      "SEK_per_kWh": 0.84386,
      "EUR_per_kWh": 0.07324,
      "EXR": 11.52178,
      "time_start": "2024-11-27T21:00:00+01:00",
      "time_end": "2024-11-27T22:00:00+01:00"
  },
  {
      "SEK_per_kWh": 0.78025,
      "EUR_per_kWh": 0.06772,
      "EXR": 11.52178,
      "time_start": "2024-11-27T22:00:00+01:00",
      "time_end": "2024-11-27T23:00:00+01:00"
  },
  {
      "SEK_per_kWh": 0.57102,
      "EUR_per_kWh": 0.04956,
      "EXR": 11.52178,
      "time_start": "2024-11-27T23:00:00+01:00",
      "time_end": "2024-11-28T00:00:00+01:00"
  }
];

let state = false
router.get("/", async (req, res) => {

  //has price for today
  // yes
  // no get price
  prices["2024-10-11"] = today;

  const allprices = prices["2024-10-11"].concat(prices["2024-10-12"])

  const sorted = allprices.sort((a, b) => {
    if (a.SEK_per_kWh < b.SEK_per_kWh) {
      return -1;
    } else {
      return 1;
    }
  })//.slice(0,5);


console.log(sorted.map(a=>a.SEK_per_kWh))


  res.send(state ? "ON" : "OFF")
  state = !state;
});


module.exports = router;
