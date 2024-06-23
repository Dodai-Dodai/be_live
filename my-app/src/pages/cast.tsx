import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";


const Client = () => {
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const peerRef = useRef<Peer | null>(null);
    const [connections, setConnections] = useState<any[]>([]);
    const [messages, setMessages] = useState<{ user: string, text: string }[]>([]);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const peerInstance = new Peer('client', {
            host: '15.168.12.232',
            port: 9000,
            path: '/'
        });
        peerRef.current = peerInstance;

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        }).then(stream => {
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            peerInstance.on('connection', conn => {
                setConnections(prev => [...prev, conn]);

                conn.on('data', data => {
                    if (typeof data === 'string') {
                        const parsedData = JSON.parse(data);
                        if (parsedData.type === 'connect_request') {
                            const call = peerInstance.call(parsedData.peerId, stream);
                            call.on('stream', remoteStream => {
                                const remoteVideo = document.createElement('video');
                                remoteVideo.id = 'remoteVideo_' + parsedData.peerId;
                                remoteVideo.autoplay = true;
                                document.body.appendChild(remoteVideo);
                                remoteVideo.srcObject = remoteStream;
                            });
                        } else if (parsedData.type === 'chat_message') {
                            setMessages(prev => [...prev, { user: parsedData.user, text: parsedData.text }]);
                        }
                    }
                });
            });
        }).catch(err => {
            console.log(err);
        });

        return () => {
            peerInstance.destroy();
        }

    }, []);

    const sendMessage = () => {
        connections.forEach(conn => {
            conn.send(JSON.stringify({ type: 'chat_message', user: 'client', text: message }));
        });
        setMessages(prev => [...prev, { user: 'client', text: message }]);
        setMessage('');
    };

    return (
        <div style={{ backgroundColor: 'white' }}>
            <h1>Client</h1>
            <div>
                <video ref={localVideoRef} autoPlay muted style={{ backgroundColor: 'black' }}></video>
            </div>
            <div>
                <h2>Chat</h2>
                <div>
                    {messages.map((msg, index) => (
                        <div key={index}>
                            <strong>{msg.user}:</strong> {msg.text}
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Client;