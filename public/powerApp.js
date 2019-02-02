
// http://www.chartjs.org

function draw(data) {
  var ctx = $("#myChart");
  var myChart = new Chart(ctx, {
    'type': 'bar',
    'data': {
        'labels': data.labels,
        'datasets': [data]
    },
    'options': {
      'scales': {
            'yAxes': [{
                'ticks': {
                    'max': data.max + (data.max *0.1),
                    'min': data.min
                }
            }]
        },
      'responsive': true,
    }
  });
}

function loadDataset(id, interval) {
  let deferred = Q.defer();
  $.getJSON("/power/graph/" + id, {"interval": interval})
  .done(function(json) {
    const data = [];
    const labels = [];

    json.forEach(function(value) {
      data.push(value.kwh);
      labels.push(value.label);
    });

    const dataset = {
        'label': "Stationsgatan 30",
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

function load(interval) {
  loadDataset("stationsgatan", interval).then(function (data) {
    draw(data);
  });
}

function padWithZero(value) {
  return (value<10) ? ("0"+value) : value;
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

$("#month").click(function(e) {
  e.preventDefault();
  $(this).tab('show');
  load("MONTH");
});

$("#year").click(function(e) {
  e.preventDefault();
  $(this).tab('show');
  load("YEAR");
});

$(document).ready(function() {
  load("MONTH");
});
