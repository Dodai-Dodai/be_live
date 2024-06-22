import React, { useState, useRef } from 'react';
import Peer from 'peerjs';
import { Button, Heading, FormControl, Label, HelperMessage, ErrorMessage, Input } from '@yamada-ui/react';

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
            host: '15.168.12.232',
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

    // 戻るボタンを押した時に切断する
    // カメラのストリームを停止する
    window.onpopstate = () => {
        if (peerRef.current) {
            peerRef.current.destroy();
        }
        if (localVideoRef.current) {
            const stream = localVideoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };

    return (
        <div style={{ backgroundColor: 'white' }}>
            <Heading>
                Viewer
            </Heading>
            <div>
                <FormControl label="peerIdInput">
                    <Input id='peerIdInput' value={peerId} onChange={e => setPeerId(e.target.value)} />
                    <Button onClick={handleConnect}>
                        Connect
                    </Button>
                </FormControl>
            </div>
            <div>
                <video ref={localVideoRef} autoPlay muted></video>
                <video ref={remoteVideoRef} autoPlay></video>
            </div>
        </div>
    );
};

export default Viewer;