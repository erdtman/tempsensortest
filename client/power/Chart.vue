<template>
  <canvas ref="canvas" :height="height"></canvas>
</template>


<script>
import Chart from "chart.js";
import axios from "axios";

export default {
  props: ["interval", "height", "lookback"],
  data() {
    return {
      chart: null,
      chartData: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: []
          }
        ]
      },
      chartType: "bar",
      chartOptions: {
        maintainAspectRatio: false,
        animation: {
          duration: 0
        },
        title: {
          display: true,
          position: "top",
          fontStyle: "bold",
          fontSize: 20
        },
        responsive: true,
        scales: {
          yAxes: [
            {
              stacked: true,
              kwh: {
                beginAtZero: true
              },
              scaleLabel: {
                display: true,
                labelString: "kWh"
              }
            }
          ]
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    };
  },
  async mounted() {
    this.chart = new Chart(this.$refs.canvas, {
        type: this.chartType,
        data: this.chartData,
        options: this.chartOptions
      });
    this.update();
  },
  methods: {
    async update() {
      try {
        const stationsgatan = await axios.get(`/power/stationsgatan/graph?interval=${this.interval}&lookback=${this.lookback}`);

        this.chartOptions.title.text = stationsgatan.data.label;
        this.chartData.labels = [];

        this.chartData.datasets[0].data = [];
        stationsgatan.data.history.forEach(element => {
          this.chartData.labels.push(element.label);
          this.chartData.datasets[0].data.push(element.kwh);

          const pGreen = 1 - element.kwh/1.5;
          const pRed = element.kwh/1.5;
          const green = 255 * pGreen;
          const red = 255 * pRed;

          this.chartData.datasets[0].backgroundColor.push(`rgba(${red}, ${green}, 0, 1.0)`);
        });

        this.chart.update();
      } catch (error) {
        console.log(`error: ${error.message}`);
      }

      if (this.lookback !== '0') {
        return; // we only refresh the view for last DAY, MONTH or YEAR
      }
      setTimeout(this.update, 60000);
    }
  }
};
</script>
