import React, { useState, useRef } from 'react';
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
        if (!peerId) {
            alert('Peer ID is required');
            return;
        }

        const peerInstance = new Peer(peerId, {
            host: '15.168.173.52',
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
                setIsConnected(true);
            });

            conn.on('data', data => {
                if (typeof data === 'string') {
                    const parsedData = JSON.parse(data);
                    if (parsedData.type === 'chat_message') {
                        setMessages(prev => [...prev, { user: parsedData.user, text: parsedData.text }]);
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
        }).catch(err => {
            console.log('Error accessing media devices', err);
        });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(event.target.value);
    };

    const handleButtonClick = () => {
        sendMessage(inputValue);
        addDisplayMessage(userID, inputValue);
        setInputValue(''); // 入力欄をクリア
    };

    const sendMessage = (text: string) => {
        if (conn) {
            conn.send(JSON.stringify({ type: 'chat_message', user: userID, text }));
            setMessages(prev => [...prev, { user: userID, text }]);
        }
    };

    const addDisplayMessage = (user: string, text: string) => {
        const newMessages = [...displayMessages, { user, text }];
        setDisplayMessages(newMessages);
        // 一定時間後にメッセージを消す
        const timeoutId = setTimeout(() => {
            setDisplayMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                updatedMessages.shift(); // 最も古いメッセージを削除
                return updatedMessages;
            });
        }, messageTimeout);
        setDisplayTimeout(timeoutId);
    };

    // コンポーネントがアンマウントされるときにタイムアウトをクリアする
    React.useEffect(() => {
        return () => {
            if (displayTimeout) {
                clearTimeout(displayTimeout);
            }
        };
    }, [displayTimeout]);

    return (
        <div className="about-container">
            <Heading className="about-title">Viewer</Heading>
            {!isConnected && (
                <div className="about-input-container">
                    <FormControl label="peerIdInput" className="about-form-control">
                        <Input id='peerIdInput' value={peerId} onChange={e => setPeerId(e.target.value)} />
                        <Button onClick={handleConnect} colorScheme="blue" style={{ marginLeft: '10px' }}>Connect</Button>
                    </FormControl>
                </div>
            )}
            <div className="about-video-container">
                <video ref={remoteVideoRef} autoPlay muted className="about-video"></video>
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
                            rows={1} // デフォルトで1行表示
                            resize="none" // ユーザーによるサイズ変更を無効化
                            style={{ marginRight: '10px' }} // ボタンとの間に少しスペースを追加
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
