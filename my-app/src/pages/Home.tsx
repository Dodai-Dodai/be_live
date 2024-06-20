import React from 'react';
import { Box, Text, Button } from '@yamada-ui/react';
import { Link } from 'react-router-dom';
import '../App.css'; // CSSファイルをインポート
import '../Anbient.css'; // CSSファイルをインポート

const Home: React.FC = () => {
    return (
        <div className="page-background">
            <div className="container">
                <Text fontSize="2xl" color="blue.500">Home Page</Text>
                <Link to="/test">
                    <Button colorScheme="blue">Go to Test Page</Button>
                </Link>

                <Link to="/about">
                    <Button colorScheme="blue">Go to about Page</Button>
                </Link>

                <Link to="/client0">
                    <Button colorScheme="blue">Go to client0 Page</Button>
                </Link>
            </div>
        </div>
    );
};

export default Home;
