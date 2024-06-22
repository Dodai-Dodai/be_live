import React from 'react';
import { Box, Text, Button } from '@yamada-ui/react';
import { Link } from 'react-router-dom';
import Be_live from '../component/header';

const Home: React.FC = () => {
    
    return (
        // home画面: このサイトの説明を記載
        <div>
            <Be_live />
            <Text fontSize="2xl" color="blue.500">Welcome to the Yamada-UI</Text>
            <Text fontSize="2xl" color="blue.500">This is a simple UI library for React</Text>
            <Text fontSize="2xl" color="blue.500">You can use this library to create a simple web application</Text>
            <Text fontSize="2xl" color="blue.500">Please click the button below to start</Text>
            <Link to="/login">
                <Button colorScheme="blue">Go to Login Page</Button>
            </Link>
        </div>
    );
};

export default Home;
