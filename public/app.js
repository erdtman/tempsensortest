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
            pointRadius: 10,
            pointHitRadius: 10,
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

$(document).ready(function() {
  $.getJSON("/measurement/sensor1", {start:"1468941950037"})
  .done(function( json ) {
    var data = [];
    var labels = [];
    var min = json[0].measurement;
    var max = json[0].measurement;
    json.forEach(function(value) {
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
});;

});
