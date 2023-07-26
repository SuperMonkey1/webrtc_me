let socket = io.connect('http://localhost:3000');
let pc = new RTCPeerConnection();
let channel;

let remoteVideo = document.getElementById('remote-video');

pc.ontrack = (event) => {
    if (remoteVideo.srcObject !== event.streams[0]) {
        remoteVideo.srcObject = event.streams[0];
    }
};

pc.onicecandidate = ({candidate}) => {
    socket.emit('candidate', candidate);
};

document.getElementById('connect').addEventListener('click', async () => {
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
