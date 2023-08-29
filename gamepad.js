let hasController = false;
let throttle = 0;
let yaw = 0;
let steering = 0;
let twee = 0;
let drie = 0;
let lastButtonStateA = false;
let lastButtonStateB = false;
let lastButtonStateX = false;
let lastButtonStateY = false;
let lastButtonStateRT = false;
let lastButtonStateRB = false;
let lastButtonStateLT = false;
let lastButtonStateLB = false;
let lastButtonStateStart = false;
let lastButtonStateBack = false;


// Function to update throttle based on gamepad input
const getGamepadInput = () => {
    const gamepads = navigator.getGamepads();

    // Loop through all gamepads and find the first available
    for (let i = 0; i < gamepads.length; i++) {
        const gamepad = gamepads[i];
    
        
        if (gamepad) {
            hasGamepad = true;
            throttle = gamepad.axes[1];     // linker joystick op(-1) neer (1)
            steering = gamepad.axes[2];     // rechter joystick links (-1) rechts (1)
            yaw = gamepad.axes[0];         // linker joystick links (-1) rechts (1)
            drie = gamepad.axes[3];         // rechter joystick op(-1) neer (1)

            // Check the current state of the 'A' button
            const currentButtonStateA = gamepad.buttons[0].pressed;
            const currentButtonStateB = gamepad.buttons[1].pressed;
            const currentButtonStateX = gamepad.buttons[2].pressed;
            const currentButtonStateY = gamepad.buttons[3].pressed;

            const currentButtonStateLB = gamepad.buttons[4].pressed;
            const currentButtonStateRB = gamepad.buttons[5].pressed;
            const currentButtonStateLT = gamepad.buttons[6].pressed;
            const currentButtonStateRT = gamepad.buttons[7].pressed;

            const currentButtonStateBack = gamepad.buttons[8].pressed;
            const currentButtonStateStart = gamepad.buttons[9].pressed;

            // Detect a single button press event for 'A' button
            if (currentButtonStateA && !lastButtonStateA) {
                console.log("'A' button was just pressed");
            }
            if (currentButtonStateB && !lastButtonStateB) {
                console.log("'B' button was just pressed");
            }    
            if (currentButtonStateX && !lastButtonStateX) {
                console.log("'X' button was just pressed");
            }
            if (currentButtonStateY && !lastButtonStateY) {
                console.log("'Y' button was just pressed");
            }
            if (currentButtonStateStart && !lastButtonStateStart) {
                console.log("'Start' button was just pressed");
            }
            if (currentButtonStateBack && !lastButtonStateBack) {
                console.log("'Back' button was just pressed");
            }
            if (currentButtonStateLB && !lastButtonStateLB) {
                console.log("'LB' button was just pressed");
            }
            if (currentButtonStateRB && !lastButtonStateRB) {
                console.log("'RB' button was just pressed");
            }
            if (currentButtonStateLT && !lastButtonStateLT) {
                console.log("'LT' button was just pressed");
            }
            if (currentButtonStateRT && !lastButtonStateRT) {
                console.log("'RT' button was just pressed");
            }

            document.getElementById("throttleValue").innerText = throttle;
            document.getElementById("steeringValue").innerText = steering;

            // If you want to break after the first available gamepad, uncomment the next line
            // break;
        }
    }
    
    // Update the throttle at 60fps
    requestAnimationFrame(getGamepadInput);
};

// Start the throttle update loop
getGamepadInput();
