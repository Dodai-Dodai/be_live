import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Text, Button, Loading } from '@yamada-ui/react';
import Header from '../component/header';

const UserPage: React.FC = () => {
    // localStorageに保存されているuserIDを取得
    const userID = localStorage.getItem('userid');
    const [isMatching, setIsMatching] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const navigate = useNavigate();

    const blockBrowserBack = useCallback(() => {
        window.history.go(1)
    }, [])

    useEffect(() => {
        // 直前の履歴に現在のページを追加
        window.history.pushState(null, '', window.location.href)

        // 直前の履歴と現在のページのループ
        window.addEventListener('popstate', blockBrowserBack)

        // クリーンアップは忘れない
        return () => {
            window.removeEventListener('popstate', blockBrowserBack)
        }
    }, [blockBrowserBack])

    // ランダムマッチング用
    const handleNavigate = async () => {
        const url = 'https://be-live.ytakag.com/api/randomuser';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userid: userID })
            });
            const data = await response.json(); // -> { userid: 'xxxx', peerid: 'yyyy' }
            console.log(data);
            if (data == '404') {
                console.log('リクエストが404です。5秒後に再試行します。');
            } else {
                // stopMatching();
                const peerid = data.peerid;
                if (data.userid === userID) {
                    console.log('host');
                    navigate('/client0', { state: { peerid } });
                } else {
                    console.log('viewer');
                    navigate('/viewer', { state: { peerid } });
                }
            }
        } catch (error) {
            console.error('リクエストエラー:', error);
        }
    };

    const startMatching = () => {
        if (!isMatching) {
            setIsMatching(true);
            intervalRef.current = setInterval(handleNavigate, 5000);
        }
    };

    const stopMatching = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsMatching(false);
    };

    useEffect(() => {
        return () => {
            stopMatching(); // コンポーネントがアンマウントされる時にマッチングを停止
        };
    }, []);

    return (
        <div>
            <Header />
            {/* <Text fontSize="2xl" color="blue.500">Your userID is {userID}</Text>

            <Link to="/test">
                <Button colorScheme="blue">Go to Test Page</Button>
            </Link>

            <Link to="/about">
                <Button colorScheme="blue">Go to about Page</Button>
            </Link>

            <Link to="/client0">
                <Button colorScheme="blue">Go to client0 Page</Button>
            </Link>

            <Link to="/viewer">
                <Button colorScheme="blue">Go to viewer Page</Button>
            </Link>

            <Link to="/guest">
                <Button colorScheme="blue">Go to guest Page</Button>
            </Link> */}

            <Button colorScheme="primary" w="100%" onClick={startMatching} disabled={isMatching}>
                {isMatching ? 'マッチング中...' : 'Be-Liveに飛び込む！'}
            </Button>
            {isMatching && (
                <Button colorScheme="red" w="100%" onClick={stopMatching}>マッチングを中止</Button>
            )}
        </div>
    );
};

export default UserPage;
