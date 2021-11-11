import React, { ReactElement } from "react";
import { useHistory } from "react-router-dom";
import { Col, Layout, Row } from "antd";
import { Content, Footer } from "antd/lib/layout/layout";
import RegisterForm from "./components/RegisterForm";
import { useAuthContext } from "hooks/use-auth/use-auth-context";
import getRoute, { HOME_ROUTE } from "routes";

export default function RegisterPage(): ReactElement {
  const { state } = useAuthContext();
  const history = useHistory();

  if (state.isAuthenticated) {
    history.push(getRoute(HOME_ROUTE));
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
