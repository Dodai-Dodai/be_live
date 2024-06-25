import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Text, Button } from '@yamada-ui/react';
import Header from '../component/header';

const UserPage: React.FC = () => {
    // localstrageに保存されているuserIDを取得
    const userID = localStorage.getItem('userid');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const navigate = useNavigate();

    //ランダムマッチング用
    const handleNavigate = async () => {
        const url = 'https://be-live.ytakag.com/api/randomuser';
        try {
            const response = await fetch(url);
            if (response.status !== 404) {
                const data = await response.json();
                console.log(data);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }

                if (data.userid === userID) {
                    console.log('host');
                    navigate('/client0');
                } else {
                    console.log('viewer');
                    navigate('/viewer');
                }
            }
        } catch (error) {
            console.error('リクエストエラー:', error);
        }
    };

    useEffect(() => {
        intervalRef.current = setInterval(handleNavigate, 5000);
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <div>
            <Header />
            <Text fontSize="2xl" color="blue.500">Your userID is {userID}</Text>

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
            </Link>

            <Button colorScheme="primary" w="100%" onClick={() => navigate('/client0')}>確認</Button>
        </div>
    );
};

export default UserPage;
