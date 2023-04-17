import React, { ReactElement } from "react";
import { Layout } from "antd";
import "./SideBar.css";

function SideBar({ menu }: { menu: ReactElement }) {
  return (
    <Layout.Sider
      width={300}
      className="sidebar"
      breakpoint="lg"
      theme="light"
      collapsedWidth={0}
      trigger={null}
      style={{
        boxShadow: "3px #0000006b",
      }}
    >
      {menu}
    </Layout.Sider>
  );
}

export default SideBar;
