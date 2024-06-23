import React, { useState, useEffect, useRef } from 'react';
import {
    Textarea,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    InputLeftElement,
    InputRightElement,
} from "@yamada-ui/react"
import { Button, ButtonGroup } from "@yamada-ui/react"
import { Icon as FontAwesomeIcon } from "@yamada-ui/fontawesome"
import { faAngleUp } from "@fortawesome/free-solid-svg-icons"
import '../UItest.css'; // CSSファイルをインポート

const About: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [displayMessages, setDisplayMessages] = useState<string[]>([]);
    const [displayTimeout, setDisplayTimeout] = useState<NodeJS.Timeout | null>(null);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const messageTimeout = 3000;

    useEffect(() => {
        // カメラ映像の取得
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
        }).then(stream => {
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
        }).catch(err => {
            console.log('Error accessing media devices.', err);
        });
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(event.target.value);
    };

    const handleButtonClick = () => {
        const newMessages = [...displayMessages, inputValue];
        setDisplayMessages(newMessages);
        // 一定時間後にメッセージを消す
        const timeoutId = setTimeout(() => {
            const filteredMessages = [...displayMessages];
            filteredMessages.shift(); // 最も古いメッセージを削除
            setDisplayMessages(filteredMessages);
        }, messageTimeout);
        setDisplayTimeout(timeoutId);
        setInputValue(''); // 入力欄をクリア
    };

    // コンポーネントがアンマウントされるときにタイムアウトをクリアする
    useEffect(() => {
        return () => {
            if (displayTimeout) {
                clearTimeout(displayTimeout);
            }
        };
    }, [displayTimeout]);

    return (
        <div className="about-container">
            <h1 className="about-title">Be Live test</h1>
            <div className="about-video-container">
                <video ref={localVideoRef} autoPlay muted className="about-video"></video>
                <div className="display-messages">
                    {displayMessages.map((message, index) => (
                        <div key={index} className="message">{message}</div>
                    ))}
                </div>
            </div>
            <div className="about-input-container">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Textarea
                        placeholder="Enter your message"
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
        </div>
    );
};

export default About;
