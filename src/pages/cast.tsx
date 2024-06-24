import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { Textarea, Button } from "@yamada-ui/react";
import { Icon as FontAwesomeIcon } from "@yamada-ui/fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import '../UItest.css'; // CSSファイルをインポート

const MergedComponent: React.FC = () => {
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const peerRef = useRef<Peer | null>(null);
    const connectionsRef = useRef<any[]>([]);
    const [connections, setConnections] = useState<any[]>([]);
    const [messages, setMessages] = useState<{ user: string, text: string }[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [displayMessages, setDisplayMessages] = useState<{ user: string, text: string }[]>([]);
    const [displayTimeout, setDisplayTimeout] = useState<NodeJS.Timeout | null>(null);
    const messageTimeout = 3000;
    const userID = localStorage.getItem('userID') || 'unknown_user';

    useEffect(() => {
        const peerInstance = new Peer('client', {
            host: '15.168.146.216',
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

            const handleViewerMessage = (message: any) => {
                connectionsRef.current.forEach(connection => {
                    if (connection.peer !== peerRef.current?.id) {
                        connection.send(JSON.stringify(message));
                    }
                });
            };

            peerInstance.on('connection', conn => {
                setConnections(prev => {
                    const newConnections = [...prev, conn];
                    connectionsRef.current = newConnections;
                    return newConnections;
                });

                conn.on('data', data => {
                    if (typeof data === 'string') {
                        console.log(data);
                        const parsedData = JSON.parse(data);
                        console.log(parsedData);
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
                            sendMessage(parsedData.user, parsedData.text);
                            addDisplayMessage(parsedData.user, parsedData.text);
                        }
                    }
                });
            });

        }).catch(err => {
            console.log('Error accessing media devices or PeerJS setup.', err);
        });

        return () => {
            if (peerRef.current) {
                peerRef.current.destroy();
            }
        };
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(event.target.value);
    };

    const handleButtonClick = () => {
        sendMessage(userID, inputValue);
        addDisplayMessage(userID, inputValue);
        setInputValue(''); // 入力欄をクリア
    };

    const sendMessage = (user: string, text: string) => {
        const message = { type: 'chat_message', user, text };
        console.log("sendするメッセージ：" + message);
        connectionsRef.current.forEach(conn => {
            console.log("sendするメッセージ：" + JSON.stringify(message));
            conn.send(JSON.stringify(message));
        });
        setMessages(prev => [...prev, { user, text }]);
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

    return (
        <div className="about-container">
            <h1 className="about-title">Be Live Client</h1>
            <div className="about-video-container">
                <video ref={localVideoRef} autoPlay muted className="about-video"></video>
                <div className="display-messages">
                    {displayMessages.map((message, index) => (
                        <div key={index} className="message">
                            <strong>{message.user}:</strong> {message.text}
                        </div>
                    ))}
                </div>
            </div>
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
        </div>
    );
};

export default MergedComponent;
