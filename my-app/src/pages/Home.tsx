import React from 'react';
import { Box, Text, Button } from '@yamada-ui/react';
import { Link } from 'react-router-dom';
import Header from '../component/header';

const Home: React.FC = () => {
    
    return (
        <div>
            <Header />
            <Text fontSize="2xl" color="blue.500">Welcome to the Yamada-UI</Text>
            <Text fontSize="2xl" color="blue.500">This is a simple UI library for React</Text>
            <Text fontSize="2xl" color="blue.500">You can use this library to create a simple web application</Text>
            <Text fontSize="2xl" color="blue.500">Please click the button below to start</Text>
        </div>
    );
};

export default Home;
