import React, { ReactElement, useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { Drawer, Button, Typography, Avatar } from "antd";
import "./NavBar.css";

function NavBar({ menu }: { menu: ReactElement }) {
  const [visible, setVisible] = useState(false);

  const hideDrawer = () => {
    console.log("Hide drawer");
    setVisible(false);
  };

  return (
    <nav className="navbar">
      <Button
        className="menu"
        type="primary"
        icon={<MenuOutlined />}
        onClick={() => setVisible(true)}
      />
      <Typography.Title style={{ fontSize: 20, display: "inline" }}>
        <Avatar src="/icons/android-icon-72x72.png" />
        Buho Stocks
      </Typography.Title>
      <Drawer
        title="Navigation"
        placement="left"
        onClose={() => setVisible(false)}
        visible={visible}
      >
        {React.cloneElement(menu as React.ReactElement<any>, {
          extraCallback: hideDrawer,
        })}
      </Drawer>
    </nav>
  );
}

export default NavBar;
