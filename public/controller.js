let socket = io.connect('https://desolate-depths-29424-e1ff0b4f81bf.herokuapp.com');
let channel;
let pc = new RTCPeerConnection();
let remoteVideo = document.getElementById('remote-video');
let connectButton = document.getElementById('connect');
connectButton.disabled = true; // Initially disable the button

socket.on('robot_ready', () => {
    connectButton.disabled = false; // Enable the button when the robot is ready
});

pc.ontrack = (event) => {
    if (remoteVideo.srcObject !== event.streams[0]) {
        remoteVideo.srcObject = event.streams[0];
    }
};

pc.onicecandidate = ({candidate}) => {
    if (candidate) {
        socket.emit('candidate', candidate);
    }
};

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

connectButton.addEventListener('click', async () => {
    channel = pc.createDataChannel('chat');
    channel.onmessage = (event) => {
        document.getElementById('messages').innerText += '\n' + event.data;
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit('offer', offer);
});
