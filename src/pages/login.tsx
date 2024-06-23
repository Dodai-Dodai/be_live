import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Heading, FormControl, Label, HelperMessage, ErrorMessage, Input, VStack, Center, Grid, GridItem } from '@yamada-ui/react';
import animals from '../animal.json';
import Header from '../component/header';

const Login: React.FC = () => {
    const [animalName, setAnimalName] = useState<string>('');
    const navigate = useNavigate();

    const handleRandomAnimal = () => {
        const animalList = animals['2'];
        const randomAnimal = animalList[Math.floor(Math.random() * animalList.length)];
        setAnimalName(randomAnimal);
        localStorage.setItem('userID', randomAnimal);
    };

    const sendUserData = async () => {
        // ここにユーザー情報を送信する処理を書く
        try {
            const response = await fetch('http://localhost:3001/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userid: localStorage.getItem('userID'),
                }),
            });
            if (response.ok) {
                console.log('Success');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleNavigate = () => {
        handleRandomAnimal();
        sendUserData();
        navigate('/home', { state: { animalName } });
    };

    return (
        <div>
            <Header />
            <Center h="100vh" p={4}>
                <VStack maxW="400px" w="100%">
                    <Heading size="lg" mb={6}>Login</Heading>
                    <FormControl id="email">
                        <Label>Email</Label>
                        <Input type="email" />
                    </FormControl>
                    <FormControl id="password">
                        <Label>Password</Label>
                        <Input type="password" />
                    </FormControl>
                    <Button colorScheme="blue" w="100%">Login</Button>

                    <Button colorScheme="gray" w="100%" onClick={handleNavigate}>Guest Login</Button>
                </VStack>
            </Center>
        </div>
    );
};

export default Login;