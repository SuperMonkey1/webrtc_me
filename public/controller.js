let socket = io.connect('https://desolate-depths-29424-e1ff0b4f81bf.herokuapp.com');
let pc;
let channel;
let remoteVideo = document.getElementById('remote-video');
let hasController = false;
let controller;
let throttle = 0;

// Function to check for controller inputs
function pollController() {
    // Query the controllers
    let gamepads = navigator.getGamepads();

    for(let i = 0; i < gamepads.length; i++) {
        if(gamepads[i]) {
            // A controller is connected, update the flag and the controller variable
            hasController = true;
            controller = gamepads[i];
            break;
        }
    }

    // If a controller is connected, read its values
    if (hasController) {
        // Reading the 'A' button for example
        if (controller.buttons[0].pressed) {
            console.log('A button pressed');
        }

        // Reading one of the thumbsticks (for example, the left thumbstick's Y axis)
        throttle = controller.axes[1]; // Replace this with whichever axis you want to use for throttle
        console.log('Throttle value:', throttle);
    }

    // Poll the controller again in the next frame
    requestAnimationFrame(pollController);
}


// Fetch ICE servers
fetch('https://desolate-depths-29424-e1ff0b4f81bf.herokuapp.com/iceservers')
.then(response => response.json())
.then(data => {
    // Use the retrieved ICE servers in the RTCPeerConnection
    console.log("ice servers fetched")
    const username = data.v.iceServers.username;
    const credential = data.v.iceServers.credential;

    // Format the ICE servers as expected by RTCPeerConnection
    const iceServers = data.v.iceServers.urls.map(url => ({
        urls: url,
        username: username,
        credential: credential
    }));
    
    pc = new RTCPeerConnection({iceServers});

    pc.ontrack = (event) => {
        if (remoteVideo.srcObject !== event.streams[0]) {
            remoteVideo.srcObject = event.streams[0];
        }
    };

    pc.onicecandidate = ({candidate}) => {
        console.log("pc.onicecandidate")

        socket.emit('candidate', candidate);
    };

    document.getElementById('connect').addEventListener('click', async () => {
        console.log("on connect")
        // channel = pc.createDataChannel('chat');
        // channel.onmessage = (event) => {
        //     console.log("channel.onmessage")
        //     document.getElementById('messages').innerText += '\n' + event.data;
        //     //localSocket.emit('motor-command', event.data);  // Emit the data received to the local socket server
        // };
        // const offer = await pc.createOffer();
        // await pc.setLocalDescription(offer);
        // socket.emit('offer', offer);
        socket.emit('initiate_connection');

    });

    document.getElementById('disconnect_me').addEventListener('click', () => {
        console.log("on disconnect")
    
        // Close the RTCPeerConnection
        if (pc) {
            pc.close();
        }
    
        // Send a message to the server to inform the other end to also close the connection
        socket.emit('disconnect_me');
    });

    socket.on('offer', async (offer) => {
        console.log("on offer")

        pc.ondatachannel = (event) => {
            channel = event.channel;
            channel.onmessage = (event) => {
                document.getElementById('messages').innerText += '\n' + event.data;
            };
        };

        await pc.setRemoteDescription(offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        // const answer = await pc.createAnswer();
        // await pc.setLocalDescription(answer);
        // console.log("emitting answer")

        socket.emit('answer', answer);
    });

    // socket.on('answer', (answer) => {

    //     pc.ondatachannel = (event) => {
    //         channel = event.channel;
    //         channel.onmessage = (event) => {
    //             document.getElementById('messages').innerText += '\n' + event.data;
    //         };
    //     };

    //     console.log("socket.on('answer'")
    //     pc.setRemoteDescription(answer);
    // });

    socket.on('candidate', (candidate) => {
        console.log("socket.on('candidate")

        pc.addIceCandidate(candidate);
    });

    document.getElementById('message-form').addEventListener('submit', function(event) {
        console.log("on message form")

        event.preventDefault();
        const message = document.getElementById('message-input').value;
        document.getElementById('message-input').value = '';
        channel.send(message);
    });
})
.catch(error => {
    console.error('Error fetching ICE servers.', error);
});

// Start polling the controller
pollController();