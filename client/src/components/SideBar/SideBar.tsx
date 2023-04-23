import { ReactElement } from "react";
import { Layout, theme } from "antd";
import "./SideBar.css";

const { useToken } = theme;

function SideBar({ menu }: { menu: ReactElement }) {
  const { token } = useToken();
  return (
    <Layout.Sider
      width={250}
      className="sidebar"
      breakpoint="lg"
      theme="light"
      collapsedWidth={0}
      trigger={null}
      style={{ borderRight: `1px solid ${token.colorBorder}` }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ flex: 1, position: "sticky", top: 0, left: 0 }}>
          {menu}
        </div>
      </div>
    </Layout.Sider>
  );
}

export default SideBar;
