import React, { useEffect, useRef } from "react";
import Peer from "peerjs";

const Client = () => {
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const peerRef = useRef<Peer | null>(null);

    useEffect(() => {
        const peerInstance = new Peer('client', {
            host: 'localhost',
            port: 9000,
            path: '/'
        });
        peerRef.current = peerInstance;

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
        }).then(stream => {
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            peerInstance.on('connection', conn => {
                conn.on('data', peerId => {
                    const call = peerInstance.call(peerId as string, stream);
                    call.on('stream', remoteStream => {
                        const remoteVideo = document.createElement('video');
                        remoteVideo.id = 'remoteVideo_' + peerId;
                        remoteVideo.autoplay = true;
                        document.body.appendChild(remoteVideo);
                        remoteVideo.srcObject = remoteStream;
                    });
                });
            });
        }).catch(err => {
            console.log(err);
        });

        return () => {
            peerInstance.destroy();
        }

    }, []);

    return (
        <div style={{ backgroundColor: 'white' }}>
            <h1>
                Client
            </h1>
            <div>
                <video ref={localVideoRef} autoPlay muted style={{ backgroundColor: 'black' }}></video>
            </div>
        </div>
    );
};

export default Client;
