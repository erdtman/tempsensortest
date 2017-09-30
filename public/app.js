
// http://www.chartjs.org

function draw(datasets, min, max, labels) {
  var ctx = $("#myChart");
  var myChart = new Chart(ctx, {
    'type': 'line',
    'data': {
        'labels': labels,
        'datasets': datasets
    },
    'options': {
      'scales': {
            'yAxes': [{
                'ticks': {
                    'max': max + 1,
                    'min': min - 1
                }
            }]
        },
      'responsive': true,
    }
  });
}

function loadDataset(id, interval, format) {
  let deferred = Q.defer();
  $.getJSON("/v2/measurement/" + id, {"interval": interval})
  .done(function( json ) {
    var data = [];
    var labels = [];

    json.measurements.forEach(function(value) {
      if(parseInt(value.measurement) < -50 || parseInt(value.measurement) > 50) {
        return;
      }
      data.push(value.measurement);
      var date = new Date(value._id);
      labels.push(format(date));
    });

    const dataset = {
        'label': json.device.name, // does not exist yet
        'fill': false,
        'lineTension': 0.5,
        'backgroundColor': "rgba(75,0,192,0.4)",
        'borderColor': "rgba(75,0,192,1)",
        'borderCapStyle': 'butt',
        'borderDash': [],
        'borderDashOffset': 0.0,
        'borderJoinStyle': 'miter',
        'pointBorderColor': "rgba(75,0,192,1)",
        'pointBackgroundColor': "#fff",
        'pointBorderWidth': 1,
        'pointHoverRadius': 5,
        'pointHoverBackgroundColor': "rgba(75,0,192,1)",
        'pointHoverBorderColor': "rgba(220,0,220,1)",
        'pointHoverBorderWidth': 2,
        'pointRadius': 1,
        'pointHitRadius': 1,
        'data': data,
        'min': Math.min(...data),
        'max': Math.max(...data),
        'labels': labels
    };
    deferred.resolve(dataset);
  }).fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
    return deferred.reject(new Error(err));
  });
  return deferred.promise;
}

function load(interval, format) {
  const devices = ['2c001f000147353138383138', '45005c000351353530373132'];
  const promises = [];

  devices.forEach( (deviceId) => {
    promises.push(loadDataset(deviceId, interval, format));
  })

  Q.allSettled(promises).then(function (results) {
    const datasets = [];
    results.forEach(function (result) {
        if (result.state === "fulfilled") {
            datasets.push(result.value);
        } else {
          throw new Error('promis not fullfilled');
        }
    });
    const max = datasets.reduce(function(a, b) {
      return Math.max(a.max, b.max);
    });
    const min = datasets.reduce(function(a, b) {
      return Math.min(a.min, b.min);
    });
    datasets.forEach((dataset))
    draw(datasets, min, max, datasets[0].labels);
  });
}

var padWithZero = function(value) {
  return (value<10) ? ("0"+value) : value;
}

$("#hour").click(function(e) {
  e.preventDefault();
  $(this).tab('show');
  load("HOUR", function(date) {
    var hour = padWithZero(date.getHours());
    var minute = padWithZero(date.getMinutes());
    return hour + ":" + minute;
  });
});

var weekDays = [
  "sön",
  "mon",
  "tis",
  "ons",
  "tor",
  "fre",
  "lör"
]
$("#day").click(function(e) {
  e.preventDefault();
  $(this).tab('show');
  load("DAY", function(date) {
    var hour = padWithZero(date.getHours());
    var minute = padWithZero(date.getMinutes());
    return hour + ":" + minute;
  });
});

$("#week").click(function(e) {
  e.preventDefault();
  $(this).tab('show');
  load("WEEK", function(date) {
    var hour = padWithZero(date.getHours());
    var minute = padWithZero(date.getMinutes());
    var day = date.getDay();
    return weekDays[day] + ", " + hour + ":" + minute;
  });
});

$("#month").click(function(e) {
  e.preventDefault();
  $(this).tab('show');
  load("MONTH", function(date) {
    var hour = padWithZero(date.getHours());
    var minute = padWithZero(date.getMinutes());
    var month = padWithZero(date.getMonth());
    var date = padWithZero(date.getDate());
    return  date + "/" + month +", " + hour + ":" + minute;
  });
});

var getCurrentTemperature = function() {
  $.getJSON("/measurement/2c001f000147353138383138/now")
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
  load("HOUR", function(date) {
    var hour = date.getHours();
    var minute = date.getMinutes();
    return hour + ":" + minute;
  });
  setInterval(getCurrentTemperature, 10000);
  getCurrentTemperature();
});
