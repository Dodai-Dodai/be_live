import React from 'react';
import { Box, Text, Button } from '@yamada-ui/react';
import { Link } from 'react-router-dom';
import Header from '../component/header';

const UserPage: React.FC = () => {
    // localstrageに保存されているuserIDを取得
    const userid = localStorage.getItem('userID');

    return (
        <div>
            <Header />
            <Text fontSize="2xl" color="blue.500">Your userID is {userid}</Text>

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
        </div>
    );
};

export default UserPage;
