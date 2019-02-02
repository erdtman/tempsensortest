/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const t = require('./models/Tick.js');
const moment = require('moment');

exports.display = function(req, res) {
    const id = req.params.id ;
  
    if (!id) {
        return res.status(400).send("missing parameter");
    }

    const now = moment();
    const data = {
        "hour_consumption" : "?",
        "day_consumption": "?",
        "month": now.format("MMMM"),
        "month_consumption": "?",
        "year": now.format("YYYY"),
        "year_consumption": "?"
      }
    t.readLast(id, "HOUR").then(function(hour_consumption) {
        data.hour_consumption = hour_consumption;
        console.log(data);
        return t.readLast(id,"DAY")
    }).then(function(day_consumption) {
        data.day_consumption = day_consumption;
        console.log(data);
        return t.readLast(id,"MONTH")
    }).then(function(month_consumption) {
        data.month_consumption = month_consumption;
        console.log(data);
        return t.readLast(id,"YEAR")
    }).then(function(year_consumption) {
        data.year_consumption = year_consumption;
        console.log(data);
        res.render('power', data);
    }).fail(function(error) {
        res.status(500).send(error);
    });
};

exports.tick = function(req, res) {
    const id = req.params.id ;
  
    if (!id) {
        return res.status(400).send("missing parameter");
    }
  
    t.create(id).then(function() {
        res.send();
    }).fail(function(error) {
        res.status(500).send(error);
    });
};

exports.powerConsumption = function(req, res){
    const id = req.params.id ;
    const interval = req.query.interval || "HOUR";
  
    if (!id) {
        return res.status(400).send("missing parameter");
    }
    
    t.readLast(id, interval).then(function(value) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(value));
    }).fail(function(error) {
        res.status(500).send(error);
    });
}

exports.powerGraph = function(req, res){
    const id = req.params.id;
    const interval = req.query.interval || "HOUR";
  
    if (!id) {
        return res.status(400).send("missing parameter");
    }
    console.log("power id: " + id);
    
    t.history(id, interval).then(function(value) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(value));
    }).fail(function(error) {
        res.status(500).send(error);
    });
}

exports.powerGraph2 = function(req, res){
    const id = req.params.id;
    const interval = req.query.interval || "HOUR";
  
    if (!id) {
        return res.status(400).send("missing parameter");
    }
    console.log("power id: " + id);
    
    t.history2(id, interval).then(function(value) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(value, null, 2));
    }).fail(function(error) {
        res.status(500).send(error);
    });
}