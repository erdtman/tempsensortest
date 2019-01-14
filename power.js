/*jshint esversion: 6 */
/*jslint node: true */
'use strict';

const t = require('./models/Tick.js');

exports.display = function(request, res) {
    res.render('power', {
        "hour_consumption" : "1",
        "day": "Monday",
        "day_consumption": "3",
        "week_consumption": "6",
        "month": "January",
        "month_consumption": "24",
        "year": "2019",
        "year_consumption": "303"
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