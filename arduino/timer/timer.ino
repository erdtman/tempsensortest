
#include "esp8266_setup/setup.h"

#include "NexaCtrl.h"

#define TX_PIN 14
#define RX_PIN 12

const static unsigned long controller_id = 2019001;
unsigned int device = 0;

NexaCtrl nexaCtrl(TX_PIN, RX_PIN);

bool parent_setup_done = false;
void setup() {
  Serial.begin(115200);

  parent_setup_done = parentSetup("timer_v1");
  Serial.print(parent_setup_done);
  if (!parent_setup_done) {
    Serial.println("FAIIIIIIILLL");
    return;
  }

  pinMode(0, OUTPUT);
  digitalWrite(0, HIGH);
  // insert setup code
}


long next_event = 0;
void loop() {
  if (!parent_setup_done) {
    Serial.println("Parent setup not done");
    delay(10000);
    return;
  }

  bool parent_done = parentLoop();
  if (!parent_done) {
    return;
  }

  if(next_event < time(nullptr)) {
    // TODO get URL from env
    digitalWrite(0, LOW);
    http.begin(client, "https://tempsensortest.herokuapp.com/timer/stationsgatan/state_v3");
    int httpCode = http.GET();
    Serial.print("http response code: ");
    Serial.println(httpCode);
    if (httpCode != 200) {
      return;
    }
    String res = http.getString();
    int wait = atoi(res.c_str());
    http.end(); 
    digitalWrite(0, HIGH);
  
    if ((wait % 2) == 1) { // odd for ON
      Serial.println("Turning ON lights");
      nexaCtrl.DeviceOn(controller_id, device);
      delay(200);
      nexaCtrl.DeviceOn(controller_id, device);
    } else { // even for OFF
      Serial.println("Turning OFF lights");
      nexaCtrl.DeviceOff(controller_id, device);
      delay(200);
      nexaCtrl.DeviceOff(controller_id, device);
    }

    next_event = time(nullptr) + wait/1000;
  }
}
