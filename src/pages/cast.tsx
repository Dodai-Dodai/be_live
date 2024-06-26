import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { useNavigate } from "react-router-dom";
import {
    Textarea,
    Button,
    Modal,
    ModalOverlay,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Box,
    Heading,
    FormControl
} from "@yamada-ui/react";
import { Icon as FontAwesomeIcon } from "@yamada-ui/fontawesome";
import { faAngleUp, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
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
    const { isOpen, onOpen, onClose } = useDisclosure();
    const timeout = 30000;
    const userID = localStorage.getItem('userid') || 'unknown_user';
    const navigate = useNavigate(); // For navigation
    const [countdown, setCountdown] = useState<number>(timeout/1000); // Countdown state initialized to 60 seconds

    useEffect(() => {
        const handlePermissionRequest = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                onClose(); // パーミッションが付与されている場合、パーミッション・モーダルを閉じる
            } catch (error) {
                console.error("Permission denied for video/audio", error);
            }
        };

        onOpen(); // 許可リクエストのモーダルを開く

        const peerInstance = new Peer('client', {
            host: 'be-live.ytakag.com',
            port: 443,
            path: '/peerjs',
            secure: true
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
        }, );
    };

    useEffect(() => {
        if (displayTimeout) {
            clearTimeout(displayTimeout);
        }
        const timer = setTimeout(() => {
            navigate('/'); // 指定時間後に/へリダイレクト
        }, countdown*1000);

        const countdownInterval = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => {
            clearTimeout(timer);
            clearInterval(countdownInterval);
        };
    }, [displayTimeout, navigate]);

    return (
        <div className="about-container">
            <Heading className="about-title">Be Live Client</Heading>
            <div className="about-video-container">
                <video ref={localVideoRef} autoPlay muted playsInline className="about-video"></video>
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
                        style={{ marginRight: '10px', fontSize: '16px'}}
                        width="auto"
                    />
                    <Button
                        colorScheme="gray"
                        variant="outline"
                        rightIcon={<FontAwesomeIcon icon={faPaperPlane} style={{ color: "#ffffff" }} />}
                        onClick={handleButtonClick}
                    >
                    </Button>
                </div>
            </div>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <Box>
                    <ModalHeader>カメラとマイクの使用許可</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        このアプリはカメラとマイクの使用を求めています。許可しますか？
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={async () => {
                            await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                            onClose();
                        }}>
                            許可
                        </Button>
                    </ModalFooter>
                </Box>
            </Modal>
        </div>
    );
};

export default MergedComponent;