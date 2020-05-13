<template>
  <canvas ref="canvas" :height="height"></canvas>
</template>


<script>
import Chart from "chart.js";
import axios from "axios";

export default {
  props: ["interval", "height"],
  data() {
    return {
      chart: null,
      chartData: {
        labels: [],
        datasets: [
          {
            data: [],
            label: "Inne",
            backgroundColor: "#CC2020",
            borderColor: "#CC2020",
            fill: false
          },
          {
            data: [],
            label: "Ute",
            backgroundColor: "#2010CC",
            borderColor: "#2020CC",
            fill: false
          }
        ]
      },
      chartType: "line",
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
              ticks: {
                suggestedMin: 0,
                suggestedMax: 30
              },
              scaleLabel: {
                display: true,
                labelString: "°C"
              }
            }
          ]
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        elements: {
          point: {
            radius: 0
          }
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
        const [indoor, outdoor] = await Promise.all([
        axios.get(`/measurement/indoor?interval=${this.interval}`),
        axios.get(`/measurement/outdoor?interval=${this.interval}`)]);

        this.chartOptions.title.text = indoor.data.label;
        this.chartData.labels = [];
        indoor.data.forEach(element => {
          this.chartData.labels.push(element.label);
        });

        this.chartData.datasets[0].data = [];
        indoor.data.forEach(element => {
          this.chartData.datasets[0].data.push(element.measurement);
        });

        this.chartData.datasets[1].data = [];
        outdoor.data.forEach(element => {
          this.chartData.datasets[1].data.push(element.measurement);
        });

        this.chart.update();
      } catch (error) {
        console.log(`error: ${error.message}`);
      }

      setTimeout(this.update, 60000);
    }
  }
};
</script>
