import React, { useRef } from "react";
import { Box, Text, Button, useNotice } from "@yamada-ui/react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
    // もしlocalStorageにuserIDが保存されていれば取得
    const userID = localStorage.getItem('userid');
    const notice = useNotice()

    // 画面上部に表示する // userIDがあればそれも一緒に表示

    const handleNavigate = async () => {
        const randomAnimal = localStorage.getItem('userid');
        // animalNameを/adduserに対してpostする
        const url = 'https://be-live.ytakag.com/api/deleteuser';
        const data = { userid: randomAnimal };
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    };

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            padding="10px 20px"
            borderBottom="1px solid #ddd"
            backgroundColor="gray.900" // 背景色をグレーに設定
        >
            <Button variant="outline" colorScheme="test" size="lg">
                <Link to="/">
                    be_live
                </Link>
            </Button>

            <Box>
                {userID && <Text marginRight="10px" color="primary">{userID} さん</Text>}
                <Button variant="outline" colorScheme="test" onClick={handleNavigate}>
                    <Link to="/login">
                        ログイン
                    </Link>
                </Button>

                <Button variant="outline" colorScheme="test" onClick={() =>
                    notice({ description: "まだないです〜", isClosable: true, })
                }>
                    {/* <Link to="/signup"> */}
                    新規登録
                    {/* </Link> */}
                </Button>

            </Box >
        </Box >
    );
};

export default Header;