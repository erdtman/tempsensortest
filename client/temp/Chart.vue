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
            lable: "Inne",
            backgroundColor: "#FF0000",
            borderColor: "#FF0000",
            fill: false
          },
          {
            data: [],
            lable: "Ute",
            backgroundColor: "#00FF00",
            borderColor: "#00FF00",
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
                suggestedMin: -10,
                suggestedMax: 50
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

      //setTimeout(this.update, 30000);
    }
  }
};
</script>
