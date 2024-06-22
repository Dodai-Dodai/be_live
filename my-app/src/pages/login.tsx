import React, {useState, useRef} from 'react';
import { Button, Heading, FormControl, Label, HelperMessage, ErrorMessage, Input, VStack, Center, Grid, GridItem } from '@yamada-ui/react';
import { Form } from 'react-router-dom';

const Login: React.FC = () => {
    return (
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
            </VStack>
        </Center>
    );
};

export default Login;