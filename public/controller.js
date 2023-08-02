let socket = io.connect('https://desolate-depths-29424-e1ff0b4f81bf.herokuapp.com');

let pc;
let channel;

let remoteVideo = document.getElementById('remote-video');

// Fetch ICE servers
fetch('https://desolate-depths-29424-e1ff0b4f81bf.herokuapp.com/iceservers')
.then(response => response.json())
.then(data => {
    // Use the retrieved ICE servers in the RTCPeerConnection
    
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
        socket.emit('candidate', candidate);
    };

    document.getElementById('stop').addEventListener('click', () => {
        // Disconnect from the robot and stop streaming video
        if (pc) {
            pc.getTracks().forEach(track => track.stop());
            pc.close();
            pc = null;
        }
        // Create a new peer connection for the next time the 'start' button is clicked
        pc = new RTCPeerConnection({iceServers});
    });

    document.getElementById('start').addEventListener('click', async () => {

         // Create a data channel
        channel = pc.createDataChannel('chat');
        channel.onmessage = (event) => {
            document.getElementById('messages').innerText += '\n' + event.data;
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('offer', offer);
    });

    socket.on('offer', async (offer) => {
        pc.ondatachannel = (event) => {
            channel = event.channel;
            channel.onmessage = (event) => {
                document.getElementById('messages').innerText += '\n' + event.data;
            };
        };

        await pc.setRemoteDescription(offer);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit('answer', answer);
    });

    socket.on('answer', (answer) => {
        pc.setRemoteDescription(answer);
    });

    socket.on('candidate', (candidate) => {
        pc.addIceCandidate(candidate);
    });

    document.getElementById('message-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const message = document.getElementById('message-input').value;
        document.getElementById('message-input').value = '';
        channel.send(message);
    });
})
.catch(error => {
    console.error('Error fetching ICE servers.', error);
});
