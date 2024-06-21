import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Text } from '@yamada-ui/react';

const Conf: React.FC = () => {
    const location = useLocation();
    const state = location.state as { animalName?: string };
    const animalName = state?.animalName || '不明';

    return (
        <Box textAlign="center">
            <Text fontSize="2xl">動物の名前: {animalName}</Text>
        </Box>
    );
};

export default Conf;
