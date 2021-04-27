#include <SocketIoClient.h>

#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include "password.h"

ESP8266WiFiMulti WiFiMulti;
SocketIoClient socket;

const char *ssid = WIFI_SSID;
const char *pass = WIFI_PASS;

//static esp8266::polledTimeout::periodicMs showTimeNow(60000);

void event(const char *payload, size_t length)
{
  Serial.printf("got message: %s\n", payload);
}

void setup()
{
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial.setDebugOutput(true);

  WiFiMulti.addAP(ssid, pass);

  while (WiFiMulti.run() != WL_CONNECTED)
  {
    delay(100);
  }

  socket.on("toggle", event);
  
  //socket.begin("sun-lit.herokuapp.com");
  socket.begin("192.168.0.2",3000);

  delay(5000);

  socket.on("message", event);

  socket.on("connect", event);
  socket.on("connect_error", event);

  socket.emit("toggle", "\"Hi host!\"");
}

void loop()
{
  // put your main code here, to run repeatedly:
  socket.loop();
}
