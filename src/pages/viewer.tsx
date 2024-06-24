import React, { useState, useRef, useEffect } from 'react';
import Peer from 'peerjs';
import {
    Textarea,
    Button,
    Heading,
    FormControl,
    Input
} from '@yamada-ui/react';
import { Icon as FontAwesomeIcon } from '@yamada-ui/fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import '../UItest.css'; // CSSファイルをインポート

const generatePeerID = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
        if (i > 0 && i % 4 === 0) {
            result += '-';
        }
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const Viewer: React.FC = () => {
    const [peerId, setPeerId] = useState('');
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const peerRef = useRef<Peer | null>(null);
    const [conn, setConn] = useState<any>(null);
    const [messages, setMessages] = useState<{ user: string, text: string }[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [displayMessages, setDisplayMessages] = useState<{ user: string, text: string }[]>([]);
    const [displayTimeout, setDisplayTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const messageTimeout = 3000;
    const userID = localStorage.getItem('userID') || 'unknown_user';

    const handleConnect = () => {
        const newPeerId = generatePeerID();
        setPeerId(newPeerId);

        const peerInstance = new Peer(newPeerId, {
            host: '15.168.146.216',
            port: 9000,
            path: '/peerjs',
            secure: true,
        });
        peerRef.current = peerInstance;

        peerInstance.on('open', () => {
            const conn = peerInstance.connect('client');
            setConn(conn);
            conn.on('open', () => {
                conn.send(JSON.stringify({ type: 'connect_request', peerId: newPeerId }));
                setIsConnected(true);
            });

            conn.on('data', data => {
                console.log(data);
                if (typeof data === 'string') {
                    const parsedData = JSON.parse(data);
                    console.log(parsedData);
                    if (parsedData.type === 'chat_message') {
                        console.log(parsedData.type + parsedData.user + parsedData.text);
                        addDisplayMessage(parsedData.user, parsedData.text);
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
        });

        peerInstance.on('error', err => {
            console.log('Error connecting to PeerJS server:', err);
        });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(event.target.value);
    };

    const handleButtonClick = () => {
        sendMessage(inputValue);
        setInputValue(''); // 入力欄をクリア
    };

    const sendMessage = (text: string) => {
        if (conn) {
            const message = { type: 'chat_message', user: userID, text };
            conn.send(JSON.stringify(message)); // Viewerから直接クライアントに送信
        }
    };

    const addDisplayMessage = (user: string, text: string) => {
        const newMessages = [...displayMessages, { user, text }];
        setDisplayMessages(newMessages);
        const timeoutId = setTimeout(() => {
            setDisplayMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                updatedMessages.shift(); // 最も古いメッセージを削除
                return updatedMessages;
            });
        }, messageTimeout);
        setDisplayTimeout(timeoutId);
    };

    useEffect(() => {
        return () => {
            if (displayTimeout) {
                clearTimeout(displayTimeout);
            }
        };
    }, [displayTimeout]);

    useEffect(() => {
        const handleMessageFromClient = (data: any) => {
            if (typeof data === 'string') {
                const parsedData = JSON.parse(data);
                if (parsedData.type === 'chat_message') {
                    setMessages(prev => [...prev, { user: parsedData.user, text: parsedData.text }]);
                    addDisplayMessage(parsedData.user, parsedData.text);
                }
            }
        };

        if (conn) {
            conn.on('data', handleMessageFromClient);
        }

        return () => {
            if (conn) {
                conn.off('data', handleMessageFromClient);
            }
        };
    }, [conn]);

    return (
        <div className="about-container">
            <Heading className="about-title">Viewer</Heading>
            {!isConnected && (
                <div className="about-input-container">
                    <FormControl label="peerIdInput" className="about-form-control">
                        <Button onClick={handleConnect} colorScheme="blue" style={{ marginLeft: '10px' }}>Connect</Button>
                    </FormControl>
                </div>
            )}
            <div className="about-video-container">
                <video ref={remoteVideoRef} autoPlay className="about-video"></video>
                <div className="display-messages">
                    {displayMessages.map((message, index) => (
                        <div key={index} className="message">
                            <strong>{message.user}:</strong> {message.text}
                        </div>
                    ))}
                </div>
            </div>
            {isConnected && (
                <div className="about-input-container">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Textarea
                            placeholder="comment"
                            _placeholder={{ opacity: 1, color: "white" }}
                            value={inputValue}
                            onChange={handleInputChange}
                            rows={1}
                            resize="none"
                            style={{ marginRight: '10px' }}
                        />
                        <Button
                            colorScheme="gray"
                            variant="outline"
                            rightIcon={<FontAwesomeIcon icon={faAngleUp} />}
                            onClick={handleButtonClick}
                        >
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Viewer;
