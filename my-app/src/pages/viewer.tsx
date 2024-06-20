import React, {useState, useRef} from 'react';
import Peer from 'peerjs';

const Viewer = () => {
    const [peerId, setPeerId] = useState('');
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const peerRef = useRef<Peer | null>(null);

    const handleConnect = () => {
        if (!peerId) {
            alert('Peer ID is required');
            return;
        }

        const peerInstance = new Peer(peerId, {
            host: 'localhost',
            port: 9000,
            path: '/'
        });
        peerRef.current = peerInstance;

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        }).then(stream => {
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            // clientに接続要求送信
            const conn = peerInstance.connect('client');
            conn.on('open', () => {
                conn.send(peerId);
            });

            peerInstance.on('call', call => {
                call.answer(stream);
                call.on('stream', remoteStream => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = remoteStream;
                    }
                });
            });
        }).catch(err => {
            console.log('Error accessing media devices', err);
        });
    };

    return (
        <div  style={{ backgroundColor: 'white' }}>
            <h1>
                Viewer
            </h1>
            <div>
                <label htmlFor='peerIdInput'>
                    Your Peer ID:
                </label>
                <input
                    type='text'
                    id='peerIdInput'
                    value={peerId}
                    onChange={e => setPeerId(e.target.value)}
                />

                <button onClick={handleConnect}>
                    Connect
                </button>
            </div>
            <div>
                <video ref={localVideoRef} autoPlay muted></video>
                <video ref={remoteVideoRef} autoPlay></video>
            </div>
        </div>
    );
};

export default Viewer;