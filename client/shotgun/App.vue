
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
              <button class="btn btn-primary input-group-btn" :disabled="!manualPosition" @click="go()">Go!</button>
            </div>
          </div>
          <div class="column col-2"> </div>
        </div>
      </div>

      <div class="column col-12">
        <div class="card margintop">
          <div class="card-body">
            {{ cardMessage }}
          </div>
        </div>
      </div>

      <div class="column col-12 fixed_to_bottom">
        <div class="columns">
          <div class="column col-2">
            <a href="/shotgun/login" class="btn btn-primary">Authorize</a>
          </div>
          <div class="column col-2">

          </div>
          <div class="column col-8">
            <div class="form-group">
              <label class="form-switch">
                <input type="checkbox" v-model="keepUnlocked" @change="keepUnlockedChange()">
                <i class="form-icon"></i>Keep phone unlocked
              </label>
            </div>
          </div>



        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { calculateDistance } from './utils';
import episodes from './episodes';

export default {
  data() {
    return {
      manualPosition: true,
      myPosition: "58.5084012, 18.9067973",
      watchId: null,
      lastPlayedTime: 0,
      cardMessage: "Ready for a new adventure?",
      wakeLock: null,
      keepUnlocked: false
    };
  },
  async beforeUnmount() {
    if (this.wakeLock) {
      await this.wakeLock.release();
      this.wakeLock = null;
    }
  },
  async mounted() {

  },
  methods: {
    async skipNext() {
      await axios.post("/shotgun/skip/next");
    },
    async addToQueue() {
      await axios.post("/shotgun/add/to/queue/6sGee4ZfCl5uK9QBkPVMD3");
    },
    async keepUnlockedChange() {
      try {
        if (this.keepUnlocked) {
          this.wakeLock = await navigator.wakeLock.request('screen');
          this.cardMessage = "Wake Lock is active";
        } else if (this.wakeLock) {
          await this.wakeLock.release();
          this.wakeLock = null;
          this.cardMessage = "Wake Lock is released";
        }
      } catch (err) {
        this.cardMessage = `${err.name}, ${err.message}`;
        console.error(`${err.name}, ${err.message}`);
      }
    },
    manualPositionChange() {
      if (this.manualPosition) {
        this.cardMessage = "Pick a location and press Go!";
        navigator.geolocation.clearWatch(this.watchId);
      } else {
        this.cardMessage = "looking for interesting places close to you...";
        this.watchId = navigator.geolocation.watchPosition(this.gotPosition, this.positionError);
      }
    },
    async gotPosition(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      this.myPosition = `${lat}, ${lon}`;
      const now = new Date().getTime();

      if (this.lastPlayedTime < now - 1000 * 60 * 10) {
        this.lastPlayedTime = now;
        this.go();
      } else {
        const minutesLeft = 10 - Math.ceil((now - this.lastPlayedTime) / 60000);
        if (minutesLeft < 5) {
          this.cardMessage = `Waiting for a while with the next item to give you a bit of time to digest what you just heard. Will look for the next item in ${minutesLeft} minutes.`;
        }
      }
    },
    async positionError() {
      this.cardMessage = "Failed to get position, please review your settings.";
    },
    async go() {
      console.log("Go!");
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
          distance: distance,
          name: episode.name,
        };
      })
        .filter(episode => episode.distance < 2)
        .sort((a, b) => a.distance - b.distance);
      console.log(distances);
      if (distances.length === 0) {
        this.cardMessage = "Nothing intersting close to you, will continue to look...";
        return;
      }

      const randomIndex = Math.floor(Math.random() * distances.length);
      const selectedEpisode = distances[randomIndex];

      this.cardMessage = `Found ${distances.length} episodes close to you, will add ${selectedEpisode.name} `;

      await axios.post(`/shotgun/add/to/queue/${selectedEpisode.episode_id}`);
      await axios.post("/shotgun/skip/next");

    }
  }
};
</script>
