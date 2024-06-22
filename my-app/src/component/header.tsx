import React from "react";
import { Box, Text, Button } from "@yamada-ui/react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
    // もしlocalStorageにuserIDが保存されていれば取得
    const userID = localStorage.getItem('userID');
    // 画面上部に表示する // userIDがあればそれも一緒に表示　なければなし
    if (localStorage.getItem('userID')) {
        return (
            <Box>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    bg="green.500"
                    p={2}
                >
                    <Text fontSize="2xl" color="white">
                        Be-live
                    </Text>
                    {userID && <Text fontSize="2xl" color="white">Your userID is {userID}</Text>}
                    <Link to="/login">
                        <Button colorScheme="blue">Login</Button>
                    </Link>
                </Box>
            </Box>
        );
    }
    return (
        <Box>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="green.500"
                p={2}
            >
                <Text fontSize="2xl" color="white">
                    Be-live
                </Text>
                <Link to="/login">
                    <Button colorScheme="blue">Login</Button>
                </Link>
            </Box>
        </Box>
    );
};

export default Header;