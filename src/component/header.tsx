import React from "react";
import { Box, Text, Button } from "@yamada-ui/react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
    // もしlocalStorageにuserIDが保存されていれば取得
    const userID = localStorage.getItem('userID');
    // 画面上部に表示する // userIDがあればそれも一緒に表示

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            padding="10px 20px"
            borderBottom="1px solid #ddd"
        >
            <Link to="/">
                <Text>be_live</Text>
            </Link>
            <Box>
                {userID && <Text marginRight="10px">{userID} さん</Text>}
                <Link to="/login">
                    <Button marginRight="10px">ログイン</Button>
                </Link>
                <Link to="/signup">
                    <Button>新規登録</Button>
                </Link>
            </Box>
        </Box>
    );
};

export default Header;