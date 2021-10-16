import { Col, Layout, Menu, PageHeader, Row } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import { useAuthContext } from "hooks/use-auth/use-auth-context";
import React, { ReactElement } from "react";
import { useHistory } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";

export default function Register(): ReactElement {
  let auth = useAuthContext();
  let history = useHistory();

  if (auth.isAuthenticated) {
    history.replace("/app");
  }

  return (
    <Layout>
      <Row>
        <Col span={12} offset={6}>
          <Content style={{ padding: "40px 50px" }}>
            <div className="site-layout-content">
              <RegisterForm />
            </div>
          </Content>
          <Footer style={{ textAlign: "center", zIndex: 999 }}>
            Bocabitlabs 2021
          </Footer>
        </Col>
      </Row>
    </Layout>
  );
}
