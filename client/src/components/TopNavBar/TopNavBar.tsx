import React, { ReactElement, useState } from "react";
import { BulbOutlined, MenuOutlined } from "@ant-design/icons";
import { Drawer, Button, Typography, Avatar, Layout, theme } from "antd";
import "./TopNavBar.css";
import TasksModal from "./components/TasksModal/TasksModal";

interface TopNavBarProps {
  menu: ReactElement;
  changeTheme: () => void;
}

const { useToken } = theme;

function TopNavBar({ menu, changeTheme }: TopNavBarProps) {
  const [visible, setVisible] = useState(false);
  // List of tasks and their statuses

  const { token } = useToken();
  // const { data, error, isLoading } = useTasksResults();

  const hideDrawer = () => {
    console.log("Hide drawer");
    setVisible(false);
  };

  return (
    <Layout>
      <Layout.Header
        className="navbar"
        style={{
          background: token.colorBgContainer,
          // boxShadow: "0 0 3px 0 #0000006b",
          paddingInline: 20,
          // zIndex: 2,
          borderBottom: `1px solid ${token.colorBorder}`,
          position: "sticky",
        }}
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
          <div>
            <Button
              type="default"
              icon={<BulbOutlined />}
              onClick={changeTheme}
            />
            <TasksModal />
          </div>
        </div>
        <Drawer
          title="Navigation"
          placement="left"
          onClose={() => setVisible(false)}
          open={visible}
          className="sidebar-drawer"
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
