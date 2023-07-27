let socket = io.connect('https://desolate-depths-29424-e1ff0b4f81bf.herokuapp.com');
let pc = new RTCPeerConnection();
let remoteVideo = document.getElementById('remote-video');

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

socket.on('answer', (answer) => {
    pc.setRemoteDescription(answer);
});

socket.on('candidate', (candidate) => {
    pc.addIceCandidate(candidate);
});

document.getElementById('connect').addEventListener('click', async () => {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit('offer', offer);
});
