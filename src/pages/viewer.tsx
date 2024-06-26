import React, { useState, useRef, useEffect } from 'react';
import Peer from 'peerjs';
import {
    Textarea,
    Button,
    Heading,
    FormControl,
    Box,
    useLoading,
} from '@yamada-ui/react';
import { Icon as FontAwesomeIcon } from '@yamada-ui/fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import '../UItest.css'; // CSSファイルをインポート
import { useLocation } from 'react-router-dom';

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
    const timeout = 30000;
    const [countdown, setCountdown] = useState<number>(timeout / 1000);
    const userID = localStorage.getItem('userid') || 'unknown_user';
    const location = useLocation();
    const state = location.state as { peerid?: string };
    const peerid = state?.peerid || '';
    const { screen, page, background } = useLoading()


    const handleConnect = () => {
        const newPeerId = generatePeerID();
        setPeerId(newPeerId);

        const peerInstance = new Peer(newPeerId, {
            host: 'be-live.ytakag.com',
            port: 443,
            path: '/peerjs',
            secure: true,
        });
        peerRef.current = peerInstance;

        peerInstance.on('open', () => {
            const conn = peerInstance.connect(peerid);
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
        }, timeout);
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

    //このページに移動してから1分後に'/'にリダイレクトする
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            window.location.href = '/';
        }, timeout);
        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    // カウントダウンロジックを追加（ページアクセス時に開始）
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown > 0) {
                    return prevCountdown - 1;
                } else {
                    clearInterval(intervalId);
                    return 0;
                }
            });
        }, 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    //ページが読み込まれるときにローディング画面を表示する

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const onLoadingPage = async () => {
        try {
            page.start()

            await wait(5000)
        } finally {
            page.finish()
        }
    }

    useEffect(() => {
        onLoadingPage();
    }, []);


    return (
        <div className="about-container">
            <Heading className="about-title">Viewer</Heading>
            {!isConnected && (
                <div className="about-input-container">
                    <FormControl className="about-form-control">
                        <Button onClick={handleConnect} colorScheme="blue" style={{ marginLeft: '10px' }}>配信を見る</Button>
                    </FormControl>
                </div>
            )}
            <div className="about-video-container">
                <video ref={remoteVideoRef} autoPlay playsInline className="about-video"></video>
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
                        <Box fontSize="lg" marginRight="10px" color="gray">
                            {countdown} 秒
                        </Box>
                        <Textarea
                            placeholder="コメントを入力"
                            _placeholder={{ opacity: 0.5, color: "gray" }}
                            value={inputValue}
                            onChange={handleInputChange}
                            rows={1}
                            resize="none"
                            style={{ marginRight: '10px', fontSize: '16px', width: '80%' }}
                        />
                        <Button
                            colorScheme="gray"
                            variant="outline"
                            rightIcon={<FontAwesomeIcon icon={faPaperPlane} style={{ color: "#ffffff", }} />}
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
function wait(arg0: number) {
    throw new Error('Function not implemented.');
}

