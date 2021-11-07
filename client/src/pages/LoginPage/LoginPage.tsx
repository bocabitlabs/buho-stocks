import React from "react";

import { Col, Layout, Row } from "antd";
import { Content, Footer } from "antd/lib/layout/layout";
import { useAuthContext } from "hooks/use-auth/use-auth-context";
import { useHistory } from "react-router-dom";
import getRoute, { HOME_ROUTE } from "routes";
import { LoginForm } from "./components/LoginForm/LoginForm";

export function LoginPage() {
  const auth = useAuthContext();
  const history = useHistory();

  if (auth.isAuthenticated) {
    history.push(getRoute(HOME_ROUTE));
  }

  return (
    <Layout>
      <Row>
        <Col span={12} offset={6}>
          <Content style={{ padding: "40px 50px" }}>
            <div className="site-layout-content">
              <LoginForm />
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

export default LoginPage;
