// src/App.js
import React from 'react';
import { Box, Text, Button } from '@yamada-ui/react';
import LoadingExample from './LoadingExample';

const App = () => {
  return (
    <Box p="4" bg="gray.100" height="100vh">
      <Text fontSize="2xl" color="blue.500">こんにちは、Yamada UI!</Text>
      <Button>Click me!</Button>

      <LoadingExample />


    </Box>
  );
}

export default App;
