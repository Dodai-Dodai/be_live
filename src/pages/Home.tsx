import React, { useCallback, useEffect } from 'react';
import { Box, Text, Button, Heading, VStack, HStack, List, ListItem, Spacer, Icon } from '@yamada-ui/react';
import Header from '../component/header';
import { Link } from 'react-router-dom';
import { MdFlashOn, MdLiveTv, MdPeople, MdStar } from 'react-icons/md';

const Home: React.FC = () => {

    const blockBrowserBack = useCallback(() => {
        window.history.go(1)
    }, [])

    useEffect(() => {
        // 直前の履歴に現在のページを追加
        window.history.pushState(null, '', window.location.href)

        // 直前の履歴と現在のページのループ
        window.addEventListener('popstate', blockBrowserBack)

        // クリーンアップは忘れない
        return () => {
            window.removeEventListener('popstate', blockBrowserBack)
        }
    }, [blockBrowserBack])
    return (
        <>
            <Header />
            <Box bg="gray.800" minH="100vh" p={8}>
                <VStack>
                    <Heading
                        bgGradient="linear(to-r, #59a9e1, #f37bdf)"
                        bgClip="text"
                        fontSize={{ base: "3xl", md: "5xl" }}
                        textAlign="center"
                        mb={8}
                        animation="gradient 3s ease infinite"
                        style={{
                            backgroundSize: '200% 200%',
                            backgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        新感覚ソーシャルアプリ、登場
                    </Heading>

                    <List width="100%">
                        <ListItem>
                            <HStack justify="center">
                                <Icon as={MdFlashOn} w={8} h={8} color="pink.400" />
                                <Text color="white" fontSize={{ base: "xl", md: "2xl" }} textAlign="center">
                                    ありのままの瞬間をキャッチ
                                </Text>
                            </HStack>
                            <Text color="white" fontSize={{ base: "sm", md: "lg" }} textAlign="left">
                                一日に数回届く通知で、その瞬間のリアルな生活をシェアしよう。時間が選べないからこそ、飾らない、ありのままの自分をさらけ出せる。友達の本当の姿、彼らの日常の一コマを覗いてみると、意外な一面が見えてくるかも?
                            </Text>
                        </ListItem>
                        <Spacer />
                        <ListItem>
                            <HStack justify="center">
                                <Icon as={MdLiveTv} w={8} h={8} color="yellow.400" />
                                <Text color="white" fontSize={{ base: "xl", md: "2xl" }} textAlign="left">
                                    瞬間を切り取る、1分間のライブ配信
                                </Text>
                            </HStack>
                            <Text color="white" fontSize={{ base: "sm", md: "lg" }} textAlign="left">
                                長時間のライブ配信に疲れる心配は無用。1分間の短いライブ配信だから、気軽に、そして自然体で共有できる。日常の小さな幸せや驚き、どんなシーンも逃さずキャッチ。
                            </Text>
                        </ListItem>
                        <Spacer />
                        <ListItem>
                            <HStack justify="center">
                                <Icon as={MdPeople} w={8} h={8} color="blue.400" />
                                <Text color="white" fontSize={{ base: "xl", md: "2xl" }} textAlign="left">
                                    リアルタイムでつながる楽しさ
                                </Text>
                            </HStack>
                            <Text color="white" fontSize={{ base: "sm", md: "lg" }} textAlign="left">
                                通知が届いた瞬間、友達や知り合いも同じようにその瞬間をシェアするから、一緒にリアルタイムでつながることができる。見て、感じて、共有する、その瞬間の一体感を体験しよう。
                            </Text>
                        </ListItem>
                        <Spacer />
                        <ListItem>
                            <HStack justify="center">
                                <Icon as={MdStar} w={8} h={8} color="purple.400" />
                                <Text color="white" fontSize={{ base: "xl", md: "2xl" }} textAlign="left">
                                    今この瞬間だけの特別感
                                </Text>
                            </HStack>
                            <Text color="white" fontSize={{ base: "sm", md: "lg" }} textAlign="left">
                                アーカイブが残らないから、その瞬間だけの特別な体験が待っている。リアルタイムでシェアされた思い出は、瞬く間に過ぎ去る。だからこそ、その瞬間がより特別に感じられる。
                            </Text>
                        </ListItem>
                    </List>
                    <Spacer />
                    <Text color="white" fontSize={{ base: "sm", md: "lg" }} textAlign="center" mt={4}>
                        あなたの「今」をみんなとシェアしよう!
                    </Text>
                </VStack>
            </Box>
        </>
    );
};

export default Home;
