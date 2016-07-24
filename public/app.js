
// http://www.chartjs.org

function draw(labels, data, min, max) {
  var ctx = $("#myChart");
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: "Utetemperatur",
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

function load(interval) {
  $.getJSON("/measurement/sensor2", {"interval": interval})
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
      var date = new Date(value._id);
      labels.push(date);

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

$("#hour").click(function(e) {
  e.preventDefault();
  $(this).tab('show');
  load("HOUR");
});

$("#day").click(function(e) {
  e.preventDefault();
  $(this).tab('show');
  load("DAY");
});

$("#week").click(function(e) {
  e.preventDefault();
  $(this).tab('show');
  load("WEEK");
});

$("#month").click(function(e) {
  e.preventDefault();
  $(this).tab('show');
  load("MONTH");
});

var getCurrentTemperature = function() {
  $.getJSON("/measurement/sensor2/now")
  .done(function( json ) {
    if(json && json.measurement) {
        $("#current").text(parseFloat(json.measurement).toFixed(1) + " °C");
    }
  })
  .fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
  });
};

$(document).ready(function() {
  load("HOUR");
  setInterval(getCurrentTemperature, 10000);
  getCurrentTemperature();
});
