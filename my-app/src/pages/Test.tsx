import React from 'react';
import { Box, Text, Button } from '@yamada-ui/react';
import LoadingExample from '../LoadingExample';

const Test = () => {
    return (
        <div className="page-background">
            <div className="container">
                <Text fontSize="2xl" color="blue.500">Yamada UI test</Text>
                <Button>Click me!</Button>

                <LoadingExample />


                <Box w="100%" h="100vh" className="card">
                    <div className="card-img" ></div>
                    <dl className="card-text">
                        <dt>Test-dayo</dt>
                        <dd>
                            Ya! Oira ha osushi ga daisuki nanda!
                            kimi ha osushi suki?
                        </dd>
                    </dl>
                </Box>
            </div>
        </div>
    );
}

export default Test;
