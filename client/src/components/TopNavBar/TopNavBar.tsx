import React, { ReactElement, useState } from "react";
import { BulbOutlined, MenuOutlined } from "@ant-design/icons";
import { Drawer, Button, Typography, Avatar, Layout, theme } from "antd";
import "./TopNavBar.css";

interface TopNavBarProps {
  menu: ReactElement;
  changeTheme: () => void;
}

const { useToken } = theme;

function TopNavBar({ menu, changeTheme }: TopNavBarProps) {
  const [visible, setVisible] = useState(false);
  const { token } = useToken();

  const hideDrawer = () => {
    console.log("Hide drawer");
    setVisible(false);
  };

  return (
    <Layout>
      <Layout.Header
        className="navbar"
        style={{ background: token.colorBgContainer }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div>
            <Button
              className="menu"
              type="default"
              icon={<MenuOutlined />}
              onClick={() => setVisible(true)}
            />
            <Typography.Title style={{ fontSize: 20, display: "inline" }}>
              <Avatar src="/icons/android-icon-72x72.png" />
              Buho Stocks
            </Typography.Title>
          </div>
          <Button
            type="default"
            icon={<BulbOutlined />}
            onClick={changeTheme}
          />
        </div>
        <Drawer
          title="Navigation"
          placement="left"
          onClose={() => setVisible(false)}
          open={visible}
        >
          {React.cloneElement(menu as React.ReactElement<any>, {
            extraCallback: hideDrawer,
          })}
        </Drawer>
      </Layout.Header>
    </Layout>
  );
}

export default TopNavBar;
