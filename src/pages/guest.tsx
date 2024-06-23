import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import animals from '../animal.json';
import { Box, Text, Button } from '@yamada-ui/react';

const Guest: React.FC = () => {
    const [animalName, setAnimalName] = useState<string>('');
    const navigate = useNavigate();

    const handleRandomAnimal = () => {
        const animalList = animals['2'];
        const randomAnimal = animalList[Math.floor(Math.random() * animalList.length)];
        setAnimalName(randomAnimal);
        alert(`あなたの名前は${randomAnimal}です`);
    };

    const handleNavigate = () => {
        if (animalName) {
            navigate('/conf', { state: { animalName } });
        } else {
            alert('まず動物の名前を取得してください');
        }
    };

    return (
        <Box textAlign="center">
            <Button colorScheme="blue" onClick={handleRandomAnimal}>
                動物の名前を取得
            </Button>
            <Button colorScheme="green" onClick={handleNavigate}>
                次のページへ
            </Button>
        </Box>
    );
};

export default Guest;
