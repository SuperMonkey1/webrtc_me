#include <Servo.h>

Servo myservo;  // create servo object to control a servo

const int pwmPinSteering = 9; // Example pin, change to your desired pin
float rawSteeringParam = 0 ; 

void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  myservo.attach(pwmPinSteering);  // attaches the servo on pin 9 to the servo object
  myservo.write(100); 
}

void loop() {
  delay(1);
  if (Serial.available()) {
    String uartData = Serial.readStringUntil('\n');
    uartData.trim(); // Remove any leading/trailing whitespace

    rawSteeringParam = uartData.toFloat(); // Convert the string to a float

    if (rawSteeringParam > 0 && rawSteeringParam <= 1) { // Check if the number is greater than 0 and less than or equal to 1
      digitalWrite(LED_BUILTIN, HIGH); // If true, turn on the LED
    } else {
      digitalWrite(LED_BUILTIN, LOW); // Otherwise, turn off the LED
    }

    float steeringAngle = 100 + rawSteeringParam * 45;
    myservo.write(steeringAngle); 
  }
}