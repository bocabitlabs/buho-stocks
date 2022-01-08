import React, { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { Col, Layout, Row } from "antd";
import { Content } from "antd/lib/layout/layout";
import RegisterForm from "./components/RegisterForm";
import AlertMessages from "components/AlertMessages/AlertMessages";
import PageFooter from "components/PageFooter/PageFooter";
import { useAuthContext } from "hooks/use-auth/use-auth-context";
import getRoute, { HOME_ROUTE } from "routes";

export default function RegisterPage(): ReactElement {
  const { state } = useAuthContext();

  if (state.isAuthenticated) {
    return <Navigate to={getRoute(HOME_ROUTE)} />;
  }

  return (
    <Layout>
      <Row>
        <Col xs={{ span: 24, offset: 0 }} lg={{ span: 12, offset: 6 }}>
          <Content style={{ padding: "40px 50px" }}>
            <div className="site-layout-content">
              <AlertMessages />
              <RegisterForm />
            </div>
          </Content>
          <PageFooter />
        </Col>
      </Row>
    </Layout>
  );
}
