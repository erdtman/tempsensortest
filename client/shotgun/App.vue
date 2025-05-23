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
          <div class="column col-4">
            <a href="/shotgun/login" class="btn btn-primary">Authorize</a>
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
    "id": "7k08vX9KrqcUYQqtR92kzi",
    "name": "Tant Bruns Kaffestuga",
    "lat": 59.6161831,
    "lon": 17.7214362
  },
  {
    "id": "6sGee4ZfCl5uK9QBkPVMD3",
    "name": "Linnés Hammarby",
    "lat": 59.8176056,
    "lon": 17.776227
  },
  {
    "id": "7LcBKslEPPM9BKnCOd4fOG",
    "name": "Heliga Birgittas bönegrotta",
    "lat": 59.7390886,
    "lon": 18.494341
  },
  {
    "id": "0uxoYjqt5GGiFhes4gB26w",
    "name": "Wiks slott",
    "lat": 59.7362983,
    "lon": 17.4622119
  },
  {
    "id": "65QuQMdgWWuh584mjvDDhi",
    "name": "Salnecke slott",
    "lat": 59.7389485,
    "lon": 17.3383306
  },
  {
    "id": "714TnlBIFimV87e1iuOPVA",
    "name": "Hammarskogs herrgård",
    "lat": 59.769467,
    "lon": 17.5622845
  },
  {
    "id": "6u0Rb8J4o02gViByPSueRg",
    "name": "Almunge Station (Lennakatten Railway)",
    "lat": 59.8759714,
    "lon": 18.0444944
  },
  {
    "id": "2WHW81IpwlCLQ78Bt1pS70",
    "name": "Albert Engström Museum",
    "lat": 60.0963243,
    "lon": 18.8141785
  },
  {
    "id": "15cI6x0szmJDLOnXgR7FqE",
    "name": "Albert Engströms Ateljé",
    "lat": 60.0946249,
    "lon": 18.8185613
  },
  {
    "id": "628HImS8eAhMB6Qkl0mpxW",
    "name": "Saltkråkan-huset (Norröra)",
    "lat": 59.6403504,
    "lon": 19.0224976
  },
  {
    "id": "42qotylFmrL0zP8VHYx6pa",
    "name": "Kompassrosen (Furusund)",
    "lat": 59.6608804,
    "lon": 18.9157197
  },
  {
    "id": "7gpALyZabugGgNbyyFlcg6",
    "name": "Aguélimuseet",
    "lat": 59.9226057,
    "lon": 16.610325
  },
  {
    "id": "6lxChqP0z3HpKgzTMLhrhB",
    "name": "Fredens hus (House of Peace)",
    "lat": 59.8577524,
    "lon": 17.6389036
  },
  {
    "id": "2U6JDY5VCPMUoV6008P7QT",
    "name": "Väsby Kungsgård",
    "lat": 59.9275957,
    "lon": 16.5935775
  },
  {
    "id": "4IgsNI7gSxiqTXzmzUTize",
    "name": "Sala Silvergruva (Sala Silver Mine)",
    "lat": 59.9073719,
    "lon": 16.5752937
  },
  {
    "id": "1Bjl5R1ObLytqbfqyrOhO4",
    "name": "Roslagens Sjöfartsmuseum",
    "lat": 59.9638072,
    "lon": 18.8149923
  },
  {
    "id": "6zJEZ00FHQ7bK8FEZrgYyn",
    "name": "Faringe Station (Heritage Railway Terminus)",
    "lat": 59.9198853,
    "lon": 18.1153073
  },
  {
    "id": "5Uhr7yMJhgulxMSxPuyGud",
    "name": "Evolutionsmuseet Zoologi",
    "lat": 59.8501782,
    "lon": 17.6262391
  },
  {
    "id": "6uw52rYwvE3bzmdv0y8Eey",
    "name": "Evolutionsmuseet Paleontologi",
    "lat": 59.8492511,
    "lon": 17.6220804
  },
  {
    "id": "2IsFwnD7eb3DudvFRcr0ti",
    "name": "Batteri Arholma",
    "lat": 59.8616199,
    "lon": 19.1230591
  },
  {
    "id": "6ilENe1KSQtHZ3JjvKn1pS",
    "name": "Ekolsunds slott",
    "lat": 59.65081,
    "lon": 17.3666064
  },
  {
    "id": "09v5CcsLcH56PdW8NtQ5C1",
    "name": "Dragon Gate (Art Hall and Cultural Center)",
    "lat": 60.4626417,
    "lon": 17.4158014
  },
  {
    "id": "40evBHQFfmHzbxEHq05XHz",
    "name": "Norrtälje Luftvärnsmuseum",
    "lat": 59.7473195,
    "lon": 18.6769373
  },
  {
    "id": "140E4sHTxu6nguNlMNyF75",
    "name": "Arlanda Flygsamlingar",
    "lat": 59.6414994,
    "lon": 17.944674
  },
  {
    "id": "4EQMsMo0M9EiNTR5b4oz0z",
    "name": "Kungsstolen (Furusund)",
    "lat": 59.6625,
    "lon": 18.9230121
  },
  {
    "id": "38efEQjV9ZBkZXNxoyZWD5",
    "name": "Kungaristningen (Furusund)",
    "lat": 59.6602232,
    "lon": 18.9171381
  },
  {
    "id": "0zLVBykjPRvLDPXa7R96bV",
    "name": "Kvarnen (Furusund Windmill)",
    "lat": 59.6600509,
    "lon": 18.9145558
  },
  {
    "id": "6cRmDlF0WgIIyRZ1adsOvm",
    "name": "Roslagsmuseet",
    "lat": 59.7584195,
    "lon": 18.6982039
  },
  {
    "id": "1ck12n3svDRoPGMOjnZUMG",
    "name": "Sigtuna rådhus",
    "lat": 59.6170013,
    "lon": 17.721329
  },
  {
    "id": "72FPfogQcIHCrthXF81TH3",
    "name": "Ryssugn (Russian Ovens of 1719)",
    "lat": 59.7815594,
    "lon": 19.0689212
  },
  {
    "id": "3gRRYammZsAnFYqLwveEex",
    "name": "Tropiska Växthuset",
    "lat": 59.850525,
    "lon": 17.6278026
  },
  {
    "id": "6JB9si7NhJxMmae18hnjEL",
    "name": "Uppsala domkyrkas skattkammare",
    "lat": 59.8582373,
    "lon": 17.6327102
  },
  {
    "id": "23kghzFTsCsoZfkYzCReR5",
    "name": "Uppsala konstmuseum",
    "lat": 59.8532485,
    "lon": 17.6351548
  },
  {
    "id": "3DHT8mCeBZ7BtF6OjR5tCR",
    "name": "Vasaborgen Uppsala slott",
    "lat": 59.8530164,
    "lon": 17.6347822
  }
];


export default {
  data() {
    return {
      manualPosition: true,
      myPosition: "58.5084012, 18.9067973",
      watchId: null,
      lastPlayedTime: 0,
      cardMessage: "Ready for a new adventure?",
      wakeLock: null
    };
  },
  beforeUnmount() {
    if (this.wakeLock) {
      this.wakeLock.release();
      this.wakeLock = null;
    }
  },
  async mounted() {
    try {
      this.wakeLock = await navigator.wakeLock.request('screen');
      this.wakeLock.addEventListener('release', () => {
        this.cardMessage += "Wake Lock was released";
        console.log('Wake Lock was released');
      });
      this.cardMessage += "Wake Lock is active";
      console.log('Wake Lock is active');
    } catch (err) {
      this.cardMessage += "Wake Lock error";
      alert(error)
      console.error(`${err.name}, ${err.message}`);
    }
  },
  methods: {
    async skipNext() {
      await axios.post("/shotgun/skip/next");
    },
    async addToQueue() {
      await axios.post("/shotgun/add/to/queue/6sGee4ZfCl5uK9QBkPVMD3");
    },
    manualPositionChange() {
      if (this.manualPosition) {
        console.log("Manual position enabled");
        this.cardMessage = "Pick a location and press Go!";
        navigator.geolocation.clearWatch(this.watchId);
      } else {
        console.log("Automatic position enabled");
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
        if(minutesLeft<5) {
          this.cardMessage = `Waiting for a while with the next item to give you a bit of time to digest what you just heard. Will look for the next item in ${minutesLeft} minutes.`;
        }
      }
    },
    async positionError() {
      this.cardMessage = "Failed to get position, please review your settings.";
      alert("Sorry, no position available.");
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
