import React, { ReactElement } from "react";
import { Layout } from "antd";
import "./SideBar.css";

function SideBar({ menu }: { menu: ReactElement }) {
  return (
    <Layout.Sider
      className="sidebar"
      breakpoint="lg"
      theme="light"
      collapsedWidth={0}
      trigger={null}
    >
      {menu}
    </Layout.Sider>
  );
}

export default SideBar;
