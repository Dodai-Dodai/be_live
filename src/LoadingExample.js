// src/LoadingExample.js
import React from 'react';
import { Wrap, Button } from '@yamada-ui/react';
import { useLoading } from '@yamada-ui/react'; // もしこのフックが含まれていない場合、追加する必要があります

const LoadingExample = () => {
    const { screen, page, background } = useLoading();

    const onLoadingScreen = async () => {
        try {
            screen.start();
            await wait(5000); // 任意の時間待機する関数
        } finally {
            screen.finish();
        }
    };

    const onLoadingPage = async () => {
        try {
            page.start();
            await wait(5000); // 任意の時間待機する関数
        } finally {
            page.finish();
        }
    };

    const onLoadingBackground = async () => {
        try {
            background.start();
            await wait(5000); // 任意の時間待機する関数
        } finally {
            background.finish();
        }
    };

    return (
        <Wrap gap="md">
            <Button onClick={onLoadingScreen}>Start screen loading</Button>
            <Button onClick={onLoadingPage}>Start page loading</Button>
            <Button onClick={onLoadingBackground}>Start background loading</Button>
        </Wrap>
    );
};

export default LoadingExample;

// 任意の時間待機するための関数を定義します
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
