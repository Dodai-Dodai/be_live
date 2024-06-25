import React from 'react';
import { Box, Text, Button } from '@yamada-ui/react';
import { Link } from 'react-router-dom';
import Header from '../component/header';
import '../UItest.css'; // CSSファイルをインポート

const Home: React.FC = () => {

    return (
        <div className="backcolor">
            <Header />
            <Text fontSize="2xl" color="hi">BeLive</Text>
            <Text fontSize="2xl" color="hi">ここ何書こうかな</Text>
            <Text fontSize="2xl" color="hi"></Text>
            <Text fontSize="2xl" color="hi">ここ</Text>
        </div>
    );
};

export default Home;
