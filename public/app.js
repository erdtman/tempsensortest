function draw(labels, data, min, max) {
  var ctx = $("#myChart");
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: "Ute temperatur",
            fill: false,
            lineTension: 0.5,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 1,
            data: data,
        }]
    },
    options: {
      scales: {
            yAxes: [{
                ticks: {
                    max: max + 2,
                    min: min - 2,
                }
            }]
        },
      responsive: true,
    }
  });
}

function load() {
  var now = new Date().getTime();
  $.getJSON("/measurement/sensor2", {start: now - interval})
  .done(function( json ) {
    var data = [];
    var labels = [];

    if(json.length < 1) {
      return; // TODO error handling
    }

    var min = json[0].measurement;
    var max = json[0].measurement;
    json.forEach(function(value) {
      if(parseInt(value.measurement) < -50 || parseInt(value.measurement) > 50) {
        return;
      }
      data.push(value.measurement);
      labels.push(value.time);
      min = Math.min(min, value.measurement);
      max = Math.max(max, value.measurement);
    });

    draw(labels, data, min, max);
  })
  .fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
  });
}

var SECOND = 1000;
var MINUTE = SECOND*60;
var HOUR = MINUTE*60;
var DAY = HOUR*24;
var WEEK = DAY*7
var MONTH = DAY*30;
var interval = HOUR;

$("#hour").click(function(e) {
  interval = HOUR;
  e.preventDefault();
  $(this).tab('show');
  load();
});

$("#day").click(function(e) {
  interval = WEEK;
  e.preventDefault();
  $(this).tab('show');
  load();
});

$("#week").click(function(e) {
  interval = HOUR;
  e.preventDefault();
  $(this).tab('show');
  load();
});

$("#month").click(function(e) {
  interval = MONTH;
  e.preventDefault();
  $(this).tab('show');
  load();
});

$(document).ready(function() {
  load();
});
