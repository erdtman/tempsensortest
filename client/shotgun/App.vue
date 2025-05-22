<template>
  <div class="container scroll">
    <div class="first_child">
      <h1>The Shotgun Guide</h1>
      <div class="column col-12">
        <div class="columns">
          <div class="column col-2"> </div>
          <div class="column col-8">
            <div class="form-group">
              <label class="form-switch">
                <input type="checkbox" v-model="manualPosition" @change="manualPositionChange()">
                <i class="form-icon"></i> Manual position
              </label>
            </div>
          </div>
          <div class="column col-2"> </div>
        </div>
      </div>


      <div class="column col-12">
        <div class="columns">
          <div class="column col-2"> </div>
          <div class="column col-8">
            <div class="input-group">
              <input type="text" class="form-input" v-model="myPosition" placeholder="Coordinates">
              <button class="btn btn-primary input-group-btn" :disabled="!manualPosition" @click="go()" >Go!</button>
            </div>


          </div>
          <div class="column col-2"> </div>
        </div>
      </div>


      <hr>
      <div class="column col-12 fixed_to_bottom">
        <div class="columns">
          <div class="column col-4">
            <a href="http://127.0.0.1:5000/shotgun/login" class="btn btn-primary">Authorize</a>
          </div>
          <div class="column col-4">
            <button class="btn btn-primary" @click="skipNext()">Skip next</button>
          </div>
          <div class="column col-4">
            <button class="btn btn-primary" @click="addToQueue()">Add to queue</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { watch } from "vue";

function calculateDistance(coord1, coord2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lon - coord1.lon);
  const lat1 = toRad(coord1.lat);
  const lat2 = toRad(coord2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const episodes = [
  {
    "id": "52JPy186vULfUjUeB2T8gb",
    "lat": 59.5084012,
    "lon": 17.9067973
  },
  {
    "id": "6sGee4ZfCl5uK9QBkPVMD3",
    "lat": 59.8176056,
    "lon": 17.776227
  },
  {
    "id": "30q1ZefHhWuGcvG9kQG1Ua",
    "lat": 60.0963243,
    "lon": 18.8141785
  },
  {
    "id": "15cI6x0szmJDLOnXgR7FqE",
    "lat": 60.0946249,
    "lon": 18.8185613
  },
  {
    "id": "7gpALyZabugGgNbyyFlcg6",
    "lat": 59.9226057,
    "lon": 16.610325
  },
  {
    "id": "18faJDbxjYd8LavweDGPzG",
    "lat": 59.8577524,
    "lon": 17.6389036
  },
  {
    "id": "2U6JDY5VCPMUoV6008P7QT",
    "lat": 59.9275957,
    "lon": 16.5935775
  },
  {
    "id": "5x2Pztban6UDdX0H3LWefu",
    "lat": 59.9073719,
    "lon": 16.5752937
  },
  {
    "id": "1Bjl5R1ObLytqbfqyrOhO4",
    "lat": 59.9638072,
    "lon": 18.8149923
  },
  {
    "id": "5Uhr7yMJhgulxMSxPuyGud",
    "lat": 59.8501782,
    "lon": 17.6262391
  }
];


export default {
  data() {
    return {
      manualPosition: true,
      myPosition: "58.5084012, 18.9067973",
      watchId: null
    };
  },
  async mounted() {

  },
  methods: {
    async gotPosition(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      this.myPosition = `${lat}, ${lon}`;
    },
    async skipNext() {
      await axios.post("/shotgun/skip/next");
    },
    async addToQueue() {
      await axios.post("/shotgun/add/to/queue/6sGee4ZfCl5uK9QBkPVMD3");
    },
    manualPositionChange () {
      if (this.manualPosition) {
        console.log("Manual position enabled");

        navigator.geolocation.clearWatch(this.watchId);
      } else {
        console.log("Automatic position enabled");
        this.watchId = navigator.geolocation.watchPosition(this.gotPosition, this.positionError);
      }
    },
    async positionError() {
      alert("Sorry, no position available.");
    },
    async go() {
      const parsed = this.myPosition.split(",").map(Number);
      const parsedPosition = {
        lat: parsed[0],
        lon: parsed[1]
      };


      const distances = episodes.map((episode) => {
        const distance = calculateDistance(
          parsedPosition, episode
        );
        return {
          episode_id: episode.id,
          distance,
        };
      })
        .filter(episode => episode.distance < 2)
        .sort((a, b) => a.distance - b.distance);
      console.log(distances);
      if (distances.length === 0) {
        alert("No episodes found within 2 km");
        return;
      }

      const randomIndex = Math.floor(Math.random() * distances.length);
      const selectedEpisode = distances[randomIndex];

      await axios.post(`/shotgun/add/to/queue/${selectedEpisode.episode_id}`);
      await axios.post("/shotgun/skip/next");

    }
  }
};
</script>
