import React from 'react';
import { Box, Text, Button } from '@yamada-ui/react';
import { Link } from 'react-router-dom';
import Header from '../component/header';

const UserPage: React.FC = () => {
    // localstrageに保存されているuserIDを取得
    const userID = localStorage.getItem('userID');


    //ランダムマッチング用
    const handleNavigate = async () => {
        const randomAnimal = localStorage.getItem('userid');
        // animalNameを/adduserに対してpostする
        const url = 'https://be-live.ytakag.com/api/randomuser';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('リクエストエラー:', error);
            });

    };

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

            <Button colorScheme="primary" w="100%" onClick={handleNavigate}>確認</Button>

        </div>
    );
};

export default UserPage;
