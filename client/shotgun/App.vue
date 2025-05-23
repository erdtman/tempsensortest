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
          <div class="column col-2">

          </div>
          <div class="column col-6">
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
import { KeepAlive } from "vue";

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
    "id": "0fsI6crcDV3AjcjoBcICXQ",
    "name": "Observatory Museum",
    "lat": 59.3415245,
    "lon": 18.054717
  },
  {
    "id": "0vMJUbiUMB4Sn0Rdq2BCaZ",
    "name": "Gamla Stan (Old Town)",
    "lat": 59.325,
    "lon": 18.0708333
  },
  {
    "id": "0KuRBhwUndN0VH2tkcC9P2",
    "name": "Moderna Museet",
    "lat": 59.3271619,
    "lon": 18.0844863
  },
  {
    "id": "2p1xWI5zyCcawDBMaMTplS",
    "name": "Carl Eldh Studio Museum",
    "lat": 59.3508029,
    "lon": 18.0412587
  },
  {
    "id": "5FJs7wBDyGCbFfA22MUO5L",
    "name": "Åkeshov Castle",
    "lat": 59.3408,
    "lon": 17.9247
  },
  {
    "id": "4hM6ONfofqwUtv8gKGJlWh",
    "name": "Bellman Museum",
    "lat": 59.3256163,
    "lon": 18.0341635
  },
  {
    "id": "126dUYMoMYuX3w77VQfxvw",
    "name": "Swedish Army Museum",
    "lat": 59.33472,
    "lon": 18.08028
  },
  {
    "id": "02Byoj4OAuuTq1WlyxHOe8",
    "name": "Jewish Museum",
    "lat": 59.3249174,
    "lon": 18.0714691
  },
  {
    "id": "2xDA99gNXpM1l3VvGHF7c5",
    "name": "Strindberg Museum",
    "lat": 59.3385,
    "lon": 18.0565611
  },
  {
    "id": "3AGdMbbrUEbrMjp2WwYSzD",
    "name": "Färgfabriken",
    "lat": 59.3119204,
    "lon": 17.9859016
  },
  {
    "id": "0XyldJWCs8u2pHWuoJYKCA",
    "name": "Stockholm City Museum",
    "lat": 59.31972,
    "lon": 18.07056
  },
  {
    "id": "1Y7dNexR34G0wem40V0LoA",
    "name": "Postmuseum",
    "lat": 59.3240164,
    "lon": 18.0722787
  },
  {
    "id": "5jIvcMvKd9As3UZUFnOtKX",
    "name": "Living History Forum",
    "lat": 59.325,
    "lon": 18.067917
  },
  {
    "id": "281PlxczDSduthQtjj8OiE",
    "name": "Nobel Prize Museum",
    "lat": 59.3250325,
    "lon": 18.0706734
  },
  {
    "id": "4pmK2LByPM2QE9VnCq49Nc",
    "name": "The Royal Armoury",
    "lat": 59.3266694,
    "lon": 18.0716694
  },
  {
    "id": "4z8sApmsz0DsBpvBVFpCQI",
    "name": "Tre Kronor Museum",
    "lat": 59.3269415,
    "lon": 18.0710466
  },
  {
    "id": "1fVbKWnhdfehOheld9TADx",
    "name": "Royal Academy of Fine Arts",
    "lat": 59.3296809,
    "lon": 18.0645315
  },
  {
    "id": "6OAGF8yfOVhLmjTGHpoSaL",
    "name": "Museum of Mediterranean and Near Eastern Antiquities",
    "lat": 59.3292377,
    "lon": 18.0674667
  },
  {
    "id": "4dpjAj2LeN36jEaFnEKyJa",
    "name": "Dance Museum (Dansmuseet)",
    "lat": 59.3324438,
    "lon": 18.0647802
  },
  {
    "id": "2lH7zQrVsrLWepR7x86DHj",
    "name": "Museum of Medieval Stockholm",
    "lat": 59.3285724,
    "lon": 18.0685584
  },
  {
    "id": "2YuF16bAJkm4OWizSCCRWh",
    "name": "Swedish Museum of Performing Arts",
    "lat": 59.33351,
    "lon": 18.0782
  },
  {
    "id": "4lSbTgaTbP3U7KLynYmsQH",
    "name": "Museum de Vries",
    "lat": 59.3212837,
    "lon": 17.887371
  },
  {
    "id": "1U5LldqHAEPbJSUMUdua5k",
    "name": "Old Central Station Clock",
    "lat": 59.3308201,
    "lon": 18.0580965
  },
  {
    "id": "6WaWbm47Tuab2mTXbArAQB",
    "name": "Fotografiska (Photography Museum)",
    "lat": 59.3175312,
    "lon": 18.0852875
  },
  {
    "id": "2JuqeoAwsns2sX2NkGDtrI",
    "name": "ArkDes (Architecture & Design Center)",
    "lat": 59.32583,
    "lon": 18.085
  },
  {
    "id": "6lFNsERnqQxJHGrC4Iw37G",
    "name": "Museum of Far Eastern Antiquities",
    "lat": 59.3274992,
    "lon": 18.0844705
  },
  {
    "id": "1djKXTB3cUo7kySZmXZZp7",
    "name": "Stockholm Toy Museum (Bergrummet)",
    "lat": 59.3279779,
    "lon": 18.0856257
  },
  {
    "id": "77mXk5bXTS4QhfufIi2H3v",
    "name": "Gustav III’s Museum of Antiquities",
    "lat": 59.3265386,
    "lon": 18.0722818
  },
  {
    "id": "0qiIpHYp2sjiXkQG5cW7Cm",
    "name": "The Royal Treasury",
    "lat": 59.3268396,
    "lon": 18.0711618
  },
  {
    "id": "7M9PSmxUYnO8Zr5QKvwne4",
    "name": "Spritmuseum (Museum of Spirits)",
    "lat": 59.3281953,
    "lon": 18.0964353
  },
  {
    "id": "3jyTGkrwL6jyDNcggYYRrA",
    "name": "Junibacken",
    "lat": 59.3273679,
    "lon": 18.0911027
  },
  {
    "id": "1utjlWJ9mkyMg3rI1z7QHE",
    "name": "Gripsholm Castle",
    "lat": 59.258611,
    "lon": 17.2247222
  },
  {
    "id": "4ZqblOiS9R3CIDSfzYMNTv",
    "name": "Callanderska Farmstead",
    "lat": 59.2581101,
    "lon": 17.2216262
  },
  {
    "id": "6sVb0hMRkdNfMTpByxchej",
    "name": "S/S Sankt Erik (Icebreaker)",
    "lat": 59.3271128,
    "lon": 18.0912981
  },
  {
    "id": "0x1q7tCUQ6ti9gyKJKp6sO",
    "name": "Lightship Finngrundet",
    "lat": 59.3270724,
    "lon": 18.0912135
  },
  {
    "id": "2j699NoolMIgutti5Tl9e9",
    "name": "HMS Spica (Torpedo Boat)",
    "lat": 59.3268499,
    "lon": 18.0897075
  },
  {
    "id": "3BCTU747o7vCXKK2bKiEib",
    "name": "Birka Viking Museum",
    "lat": 59.336,
    "lon": 17.541
  },
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
      wakeLock: null,
      keepUnlocked: false
    };
  },
  beforeUnmount() {
    if (this.wakeLock) {
      this.wakeLock.release();
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
        this.wakeLock = await navigator.wakeLock.request('screen');
        this.cardMessage += "Wake Lock is active";
      } catch (err) {
        this.cardMessage += `${err.name}, ${err.message}`;
        console.error(`${err.name}, ${err.message}`);
      }
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
        if (minutesLeft < 5) {
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
