#include <ArduinoJson.h>

#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <ESP8266httpUpdate.h>
#include <EEPROM.h>

#define GET_CREDENTIALS 1

const char* network_form ="<html><head><title>Timer setup</title><meta name='viewport' content='width=device-width, initial-scale=1' /><style>form {display: grid;}input {border-style: solid;border-radius: 7px;height: 40px;}label {padding-bottom: 5px;}body {text-align: center;}</style></head><body><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABMCAYAAADHl1ErAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAjBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjc2PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjc2PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgosDbF4AAAQTUlEQVR4Ae2cZ8gkRRPH+8w558SdOSsoBkxnOE8x5yyYA4o5IIr6QT+ooILpOEwoopgD5jMhZswJUc+cc85t/ep9/0094+zu7PPs7iFYMNs93dVV1f+uDtPTs6OyUfqPGiMwVWPOHjG2ap+69JgW4z0yZVhiBgJYrOyoUaNSvJfVpFcpptWVq5NTldHr+4EAFitOJeO9KkS6AIhx8pVeB5rKDyocZcZM8TEME+pArIIgPoXV/EHcTzMIJXU6qPRff/3lQAHWn3/+WQtaFRzKTDXVQDpGndlp4ICpwpMmTUpnnXVWWnLJJdOvv/5agBOIVWsBbvrpp09vvvlmOv7449Mmm2zigA8avIEDJiC+/fbbdN999/mltKbhQQcd1JS153xTDLBppvmf6lVWWSV9/PHHxcPonvJCvIpr6qmnTr///ntacMEF04svvphUtudoNBA4xQADCOiXX35Jn332WZpuuunSH3/8UcY18uChywHQb7/9luacc06Sy6zpN5UfyjSZQCrFGt9OudHz/yZSOcACFDwLbyJNYMEGaIxf5LUjgUUoIs6F7F7QwD1Mra9uxyCOZ+FBIuXBSxwvhF577TUHs1XlJVuAU6ZdGvldk6E/cLIK5++++y5/9NFH2cav/Pnnn+f3338/b7HFFrhGnn322fMcc8zhcdLee+895/n000+9DGVFyBLVxUm74IIL8tNPPy22bEuYElcEvlhe6dVw4B5Gi9Lqs846q19qYdZhM8wwg9/S9cx4j5O20EILteyO8iCYFaes4ixdTjzxRJd11VVXpT322MO7ODxxSQK/geN87X4GOoZhEBfGVo3DeEATaSYkLVaMfNIkS/yEkgk/AJxxxhkO1qqrrppGjx6d9tprr3T00Ucn81CXKTmSIZB1XxuakoGQGfcPl7exybviM888k6+//vq87LLLejecZZZZMhcYkEYePHRbW+QOsRe5XJA1hIc///xzPvPMM738csst56GBmFdYYQWPjx071ocCmOvsciEtfmiVvlLVIFuw5ieeeCKfe+65eZtttvEKAAzXvPPOmxdeeOFs6608//zz50UXXdTvlU+49dZb5/PPPz8/+eST+fvvvy+2A5ZNHg7ac889V+QutdRSHgcw86C8zDLL+P0888yTP/jgA+enXFPqG2BUQC2PMe+++26eMGFCXmmllUplIhDt4lSUfIXiXX311fOll17qFVeFbYHrUSaUQw45xMsBmi1LMqBRdsyYMR7SKEw6ULTVE1r89GW3gjGKcQRiFX/NNdekY4891u/jD2PLVlttlQzEtMgii6S55porTTvttD7+UJ7lxg8//ODXhx9+mF544YV02223pZdffjmK8fh5552Xdt1112QglDyrc7r66qvT3nvv7U8JPC188cUXnr/44ounyZMnpw022CDdcsstyWZmH1tldxFSjbQAsnGyxg0VUEvh5tddd523pOn07kbIdc455+Rnn3020z1bUZQb419//bUvEc4++2yXhdcZ0EXPjTfe6F0zyn3kkUdKPl6FDbF7HnDAAdnW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' alt='' /><h1>Timer setup</h1><p>Fyll i information om det lokala n&auml;tverket som timermodulen skall ansluta till.</p><form method='POST' action='/' enctype='application/x-www-form-urlencoded'><label>N&auml;tverksnamn (SSID):</label><input type='text' name='ssid' placeholder='N&auml;tverksnamn (SSID)'/> <br /><label>L&ouml;senord:</label><input type='text' name='password' placeholder='L&ouml;senord' /> <br /><input type='submit' value='Spara'/></form></body></html>";

const char* credentials_saved = "<html><head><title>Timer redo</title><meta name='viewport' content='width=device-width, initial-scale=1' /><style>body {text-align: center;}</style></head><body><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABMCAYAAADHl1ErAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAjBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjc2PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjc2PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgosDbF4AAAQTUlEQVR4Ae2cZ8gkRRPH+8w558SdOSsoBkxnOE8x5yyYA4o5IIr6QT+ooILpOEwoopgD5jMhZswJUc+cc85t/ep9/0094+zu7PPs7iFYMNs93dVV1f+uDtPTs6OyUfqPGiMwVWPOHjG2ap+69JgW4z0yZVhiBgJYrOyoUaNSvJfVpFcpptWVq5NTldHr+4EAFitOJeO9KkS6AIhx8pVeB5rKDyocZcZM8TEME+pArIIgPoXV/EHcTzMIJXU6qPRff/3lQAHWn3/+WQtaFRzKTDXVQDpGndlp4ICpwpMmTUpnnXVWWnLJJdOvv/5agBOIVWsBbvrpp09vvvlmOv7449Mmm2zigA8avIEDJiC+/fbbdN999/mltKbhQQcd1JS153xTDLBppvmf6lVWWSV9/PHHxcPonvJCvIpr6qmnTr///ntacMEF04svvphUtudoNBA4xQADCOiXX35Jn332WZpuuunSH3/8UcY18uChywHQb7/9luacc06Sy6zpN5UfyjSZQCrFGt9OudHz/yZSOcACFDwLbyJNYMEGaIxf5LUjgUUoIs6F7F7QwD1Mra9uxyCOZ+FBIuXBSxwvhF577TUHs1XlJVuAU6ZdGvldk6E/cLIK5++++y5/9NFH2cav/Pnnn+f3338/b7HFFrhGnn322fMcc8zhcdLee+895/n000+9DGVFyBLVxUm74IIL8tNPPy22bEuYElcEvlhe6dVw4B5Gi9Lqs846q19qYdZhM8wwg9/S9cx4j5O20EILteyO8iCYFaes4ixdTjzxRJd11VVXpT322MO7ODxxSQK/geN87X4GOoZhEBfGVo3DeEATaSYkLVaMfNIkS/yEkgk/AJxxxhkO1qqrrppGjx6d9tprr3T00Ucn81CXKTmSIZB1XxuakoGQGfcPl7exybviM888k6+//vq87LLLejecZZZZMhcYkEYePHRbW+QOsRe5XJA1hIc///xzPvPMM738csst56GBmFdYYQWPjx071ocCmOvsciEtfmiVvlLVIFuw5ieeeCKfe+65eZtttvEKAAzXvPPOmxdeeOFs6608//zz50UXXdTvlU+49dZb5/PPPz8/+eST+fvvvy+2A5ZNHg7ac889V+QutdRSHgcw86C8zDLL+P0888yTP/jgA+enXFPqG2BUQC2PMe+++26eMGFCXmmllUplIhDt4lSUfIXiXX311fOll17qFVeFbYHrUSaUQw45xMsBmi1LMqBRdsyYMR7SKEw6ULTVE1r89GW3gjGKcQRiFX/NNdekY4891u/jD2PLVlttlQzEtMgii6S55porTTvttD7+UJ7lxg8//ODXhx9+mF544YV02223pZdffjmK8fh5552Xdt1112QglDyrc7r66qvT3nvv7U8JPC188cUXnr/44ounyZMnpw022CDdcsstyWZmH1tldxFSjbQAsnGyxg0VUEvh5tddd523pOn07kbIdc455+Rnn3020z1bUZQb419//bUvEc4++2yXhdcZ0EXPjTfe6F0zyn3kkUdKPl6FDbF7HnDAAdnW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' alt='' /><h1>Timer redo</h1><p>Timermodulen &auml;r nu initierad och kommer nu att starta om och ansluta till ditt n&auml;tverk.</p></body></html>";

// Fingerprint for *.herokuapp.com
const char* fingerprint = "08 3b 71 72 02 43 6e ca ed 42 86 93 ba 7e df 81 c4 bc 62 30";

const static unsigned int ssid_addr = 0x00;
const static unsigned int password_addr = 0x64;

const char* host = "tempsensortest.herokuapp.com";

static unsigned int mode = 0;
ESP8266WebServer server(80);
void handleRoot();

void parentSetup() {
  Serial.begin(115200);
  Serial.println("{n\n====== AND GO ======");
  pinMode(0, OUTPUT); // error indication
  pinMode(2, OUTPUT); // ready to serve
  digitalWrite(0, HIGH);
  digitalWrite(2, HIGH);
  char probe[0x01] = { 255 };
  
  EEPROM.begin(256);
  // TODO create a better way of clearing credentials
  // EEPROM.put(ssid_addr, probe);
  // EEPROM.commit();
  EEPROM.get(ssid_addr, probe);
  if (probe[0] == 255) {
    Serial.println("No stored network credantials");
    mode = GET_CREDENTIALS;

    Serial.println("Starting soft-AP... ");
    if(WiFi.softAP("timer", NULL, 0, 0, 1)) {
      Serial.println("Soft-AP online");
    } else {
      Serial.println("Failed to start soft-AP!");
      digitalWrite(0, LOW);
      return;
    }
    
    Serial.println("Starting mDNS... ");
    if (MDNS.begin("timer")) {              // Start the mDNS responder for timer.local
      Serial.println("mDNS responder started");
    } else {
      Serial.println("Error setting up MDNS responder!");
      digitalWrite(0, LOW);
      return;
    }

    server.on("/", handleRoot);
    server.begin();
    Serial.println("HTTP server started");
    Serial.println("Waiting for credentials...");
  } else {
    Serial.println("Read stored network credentials");
    // Read credentials and connect to WiFi
    char ssid[0x64] = {0};
    char password[0x64] = {0};
  
    EEPROM.get(ssid_addr, ssid);
    EEPROM.get(password_addr, password);

    Serial.print("Connecting to ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
    Serial.println("WiFi connected");  
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());

    Serial.println("Configure time...");
    configTime(3 * 3600, 0, "pool.ntp.org");

    Serial.print("Getting device config...");

    WiFiClientSecure client;
    client.setFingerprint(fingerprint);
    Serial.print("Connecting to ");
    Serial.println(host);
    
    if (!client.connect(host, 443)) {
      Serial.println("Connection failed");
      digitalWrite(0, LOW);
      return;
    }

    StaticJsonDocument<200> doc;
    // TODO get device config

    Serial.print("MAC: ");
    Serial.println(WiFi.macAddress());

    HTTPClient http;
    http.begin(client, "https://tempsensortest.herokuapp.com/device/84:F3:EB:5A:9D:36?running=baseline");
    int httpCode = http.GET();
    Serial.print("http response code: ");
    Serial.println(httpCode);
    if (httpCode != 200) {
      digitalWrite(0, HIGH);
      return;
    }
    String device_config = http.getString();
    http.end();

    DeserializationError error = deserializeJson(doc, device_config.c_str());

    if (error) {
      Serial.print("JSON deserializeJson() failed: ");
      Serial.println(error.c_str());
      digitalWrite(0, HIGH);
      return;
    }

    const char* update_url = doc["update_url"];
    if (update_url != NULL) {
      Serial.println("New firmware available");
      
      Serial.print("Starting OTA from: ");
      Serial.println(update_url);
      
      t_httpUpdate_return ret = ESPhttpUpdate.update(client, update_url);
      Serial.println(ret);
      switch (ret) {
        case HTTP_UPDATE_FAILED:
          Serial.printf("HTTP_UPDATE_FAILD Error (%d): %s", ESPhttpUpdate.getLastError(), ESPhttpUpdate.getLastErrorString().c_str());
          digitalWrite(0, LOW);
          return;
        case HTTP_UPDATE_OK:
          Serial.println("HTTP_UPDATE_OK");
          Serial.println("Rebooting...");
          ESP.restart();
          return;
      }
    }

    digitalWrite(2, LOW);
    // TODO read env
  }
  
}

void parentLoop() {
  if(mode == GET_CREDENTIALS) {
    server.handleClient();
    MDNS.update();
  }
}

void handleRoot() {
  Serial.println("Handle root request");
  if (server.method() == HTTP_GET) {
    Serial.println("Load form");
    server.send(200, "text/html", network_form);
  } else if (server.method() == HTTP_POST) {
    Serial.println("Save network credentials");
    for (uint8_t i = 0; i < server.args(); i++) {
      if (server.argName(i) == "ssid") {
        String ssid_string = server.arg(i);
        Serial.println("Saving ssid: " + ssid_string);
        char ssid[0x64] = {0};
        // TODO verify that lenght is lesser than 100
        strncpy(ssid, ssid_string.c_str(), ssid_string.length()); 
        EEPROM.put(ssid_addr, ssid);
        
      } else if (server.argName(i) == "password") {
        Serial.println("Saving password...");
        char password[0x64] = {0};
        // TODO verify that lenght is lesser than 100
        strncpy(password, server.arg(i).c_str(), server.arg(i).length()); 
        EEPROM.put(password_addr, password);
      }
    }
    Serial.println("Commiting credentials to permanent storage...");
    EEPROM.commit();
    // TODO handle error response
    server.send(200, "text/html", credentials_saved);
    delay(5000); 
    Serial.println("Rebooting...");
    ESP.restart();
  }
}
