let socket = io.connect('https://desolate-depths-29424-e1ff0b4f81bf.herokuapp.com');
let pc = new RTCPeerConnection();
let localStream;

navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
        localStream = stream;

        localStream.getTracks().forEach(track => {
            pc.addTrack(track, localStream);
        });

        pc.onicecandidate = ({candidate}) => {
            if (candidate) {
                socket.emit('candidate', candidate);
            }
        };

        socket.on('offer', async (offer) => {
            await pc.setRemoteDescription(offer);

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            socket.emit('answer', answer);
        });

        socket.on('candidate', (candidate) => {
            pc.addIceCandidate(candidate);
        });
    })
    .catch(error => {
        console.error('Error accessing media devices.', error);
    });
