import React from "react";
import { Box, Text, Button } from "@yamada-ui/react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
    // もしlocalStorageにuserIDが保存されていれば取得
    const userID = localStorage.getItem('userid');
    // 画面上部に表示する // userIDがあればそれも一緒に表示

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
                <Button variant="outline" colorScheme="test">
                    <Link to="/login">
                        ログイン
                    </Link>
                </Button>

                <Button variant="outline" colorScheme="test">
                    <Link to="/signup">
                        新規登録
                    </Link>
                </Button>

            </Box >
        </Box >
    );
};

export default Header;