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
        localStorage.setItem('userid', randomAnimal);
    };

    const handleNavigate = async () => {
        // localStorageの中身を削除
        localStorage.removeItem('userid');
        handleRandomAnimal();
        const randomAnimal = localStorage.getItem('userid');
        // animalNameを/adduserに対してpostする
        const url = 'http://localhost:8080/api/adduser';
        const data = { userid: randomAnimal };
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            navigate('/home', { state: { randomAnimal } });
        } else {
            alert('Failed to login');
        }
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