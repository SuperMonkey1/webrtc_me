let socket = io.connect('https://desolate-depths-29424-e1ff0b4f81bf.herokuapp.com');
let localVideo = document.getElementById('local-video');
let channel;

let stream;
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(s => {
        stream = s;
        localVideo.srcObject = stream;
    })
    .catch(error => {
        console.error('Error accessing media devices.', error);
    });


let pc = new RTCPeerConnection();

// Add the video track to the peer connection
if (stream) {
    stream.getTracks().forEach(track => pc.addTrack(track, stream));
}

pc.onicecandidate = ({candidate}) => {
    socket.emit('candidate', candidate);
};

document.getElementById('connect').addEventListener('click', async () => {
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
