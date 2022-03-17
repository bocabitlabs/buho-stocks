import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, Layout, Row } from "antd";
import { Content } from "antd/lib/layout/layout";
import { LoginForm } from "./components/LoginForm/LoginForm";
import AlertMessages from "components/AlertMessages/AlertMessages";
import PageFooter from "components/PageFooter/PageFooter";
import { useAuthContext } from "hooks/use-auth/use-auth-context";

export function LoginPage() {
  const { state } = useAuthContext();
  const navigate = useNavigate();

  if (state.isAuthenticated) {
    navigate("/app/home", { replace: true });
  }
  return (
    <Layout>
      <Row>
        <Col xs={{ span: 24, offset: 0 }} lg={{ span: 12, offset: 6 }}>
          <Content style={{ padding: "40px 50px" }}>
            <Card>
              <AlertMessages />
              <LoginForm />
            </Card>
          </Content>
          <PageFooter />
        </Col>
      </Row>
    </Layout>
  );
}

export default LoginPage;
