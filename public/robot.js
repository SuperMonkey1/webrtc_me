//let socket = io.connect('https://desolate-depths-29424-e1ff0b4f81bf.herokuapp.com');
let socket = io.connect('https://roboroo-69b18e1c5d49.herokuapp.com');
//let localSocket = io.connect('http://your-raspberry-pi-ip-address:8080'); // Connect to local Socket.io server
let localSocket = io.connect('http://localhost:8080'); // Connect to local Socket.io server

let pc;
let channel;
let localVideo = document.getElementById('local-video');

// Fetch ICE servers
fetch('https://roboroo-69b18e1c5d49.herokuapp.com/iceservers')
    .then(response => response.json())
    .then(data => {
        console.log("fetched ice servers")

        const username = data.v.iceServers.username;
        const credential = data.v.iceServers.credential;

        // Format the ICE servers as expected by RTCPeerConnection
        const iceServers = data.v.iceServers.urls.map(url => ({
            urls: url,
            username: username,
            credential: credential
        }));

        pc = new RTCPeerConnection({ iceServers });

        navigator.mediaDevices.getUserMedia({width: 640, height: 480, video: true, audio: false })
        .then(stream => {
            console.log("got userstream")
            localVideo.srcObject = stream;
            // Add the video track to the peer connection
            stream.getTracks().forEach(track => pc.addTrack(track, stream));
        })
        .catch(error => {
            console.error('Error accessing media devices.', error);
        });

        pc.onicecandidate = ({ candidate }) => {
            console.log("onicecandidat")
            socket.emit('candidate', candidate);
        };

        socket.on('initiate_connection', async () => {
            console.log("socket on initiate_connection")
            channel = pc.createDataChannel('chat');

            
            channel.onmessage = (event) => {
                console.log("got message")

                try {
                    const parsedData = JSON.parse(event.data); // Try parsing the incoming data as JSON
            
                    // Check if the parsed data has a throttle property
                    if (parsedData.hasOwnProperty('throttle') && parsedData.hasOwnProperty('steering') ) {
                        console.log("has throttle property")

                        // Update the throttle value displayed in the HTML element
                        document.getElementById('throttle-data').innerText = `Throttle: ${parsedData.throttle}`;
                        document.getElementById('steering-data').innerText = `Steering: ${parsedData.steering}`;
                        //localSocket.emit('throttle', parsedData.throttle);  // Emit the data received to the local socket server
                        localSocket.emit('control_data', { throttle: parsedData.throttle, steering: parsedData.steering }); 

                    } else {
                        // Existing code for handling other types of messages
                        console.log("message has no throttle property")
                        document.getElementById('messages').innerText += '\n' + event.data;
                        //localSocket.emit('motor-command', event.data);  // Emit the data received to the local socket server
                    }
            
                } catch (e) {
                    // Incoming data wasn't JSON or an error occurred, handle as you normally would
                    console.log(" message error")
                    document.getElementById('messages').innerText += '\n' + event.data;
                    //localSocket.emit('motor-command', event.data);  // Emit the data received to the local socket server
                }
            };

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit('offer', offer);

        });

        socket.on('disconnect_me', () => {
            // Inform the other peer to also close the connection
            console.log("connection disconnected by the controller")
            pc.close();
            //socket.broadcast.emit('peerDisconnected');
        });

        socket.on('answer', (answer) => {
            console.log("socket on answer")

            pc.setRemoteDescription(answer);
        });

        socket.on('candidate', (candidate) => {
            console.log("socket on candidate")
            pc.addIceCandidate(candidate);
        });

        document.getElementById('message-form').addEventListener('submit', function (event) {
            console.log("doc on message form")

            event.preventDefault();
            const message = document.getElementById('message-input').value;
            document.getElementById('message-input').value = '';
            channel.send(message);
        });
    })
    .catch(error => {
        console.error('Error fetching ICE servers.', error);
    });
