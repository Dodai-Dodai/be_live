import React, { useState, useRef } from 'react';
import Peer from 'peerjs';
import { Button, Heading, FormControl, Input } from '@yamada-ui/react';

const Viewer = () => {
    const [peerId, setPeerId] = useState('');
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const peerRef = useRef<Peer | null>(null);
    const [conn, setConn] = useState<any>(null);
    const [messages, setMessages] = useState<{ user: string, text: string }[]>([]);
    const [message, setMessage] = useState<string>('');

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
            audio: true
        }).then(stream => {
            const conn = peerInstance.connect('client');
            setConn(conn);
            conn.on('open', () => {
                conn.send(JSON.stringify({ type: 'connect_request', peerId }));
            });

            conn.on('data', data => {
                if (typeof data === 'string') {
                    const parsedData = JSON.parse(data);
                    if (parsedData.type === 'chat_message') {
                        setMessages(prev => [...prev, { user: parsedData.user, text: parsedData.text }]);
                    }
                }
            });

            peerInstance.on('call', call => {
                call.answer();
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

    const sendMessage = () => {
        if (conn) {
            conn.send(JSON.stringify({ type: 'chat_message', user: peerId, text: message }));
            setMessages(prev => [...prev, { user: peerId, text: message }]);
            setMessage('');
        }
    };

    return (
        <div style={{ backgroundColor: 'white' }}>
            <Heading>Viewer</Heading>
            <div>
                <FormControl label="peerIdInput">
                    <Input id='peerIdInput' value={peerId} onChange={e => setPeerId(e.target.value)} />
                    <Button onClick={handleConnect}>Connect</Button>
                </FormControl>
            </div>
            <div>
                <video ref={remoteVideoRef} autoPlay></video>
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

export default Viewer;