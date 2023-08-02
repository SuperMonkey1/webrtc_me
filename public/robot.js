let socket = io.connect('https://desolate-depths-29424-e1ff0b4f81bf.herokuapp.com');
//let localSocket = io.connect('http://your-raspberry-pi-ip-address:8080'); // Connect to local Socket.io server
let localSocket = io.connect('http://localhost:8080'); // Connect to local Socket.io server

let pc;
let channel;

let localVideo = document.getElementById('local-video');

// Fetch ICE servers
fetch('https://desolate-depths-29424-e1ff0b4f81bf.herokuapp.com/iceservers')
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

    
    pc = new RTCPeerConnection({iceServers});

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

    pc.onicecandidate = ({candidate}) => {
        console.log("onicecandidat")

        socket.emit('candidate', candidate);
    };

    document.getElementById('connect').addEventListener('click', async () => {
        console.log("on connect")

        channel = pc.createDataChannel('chat');
        channel.onmessage = (event) => {
            console.log("channel.onmessage")
            document.getElementById('messages').innerText += '\n' + event.data;
            localSocket.emit('motor-command', event.data);  // Emit the data received to the local socket server
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        console.log("emitting offer")

        socket.emit('offer', offer);
    });

    socket.on('offer', async (offer) => {
        console.log("scket on offer")

        pc.ondatachannel = (event) => {
            channel = event.channel;
            channel.onmessage = (event) => {
                document.getElementById('messages').innerText += '\n' + event.data;
                localSocket.emit('motor-command', event.data);  // Emit the data received to the local socket server
            };
        };

        await pc.setRemoteDescription(offer);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        console.log("emitting answer")

        socket.emit('answer', answer);
    });

    socket.on('answer', (answer) => {
        console.log("socket on answer")

        pc.setRemoteDescription(answer);
    });

    socket.on('candidate', (candidate) => {
        console.log("socket on candidate")

        pc.addIceCandidate(candidate);
    });

    document.getElementById('message-form').addEventListener('submit', function(event) {
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
