import React from "react";
import { useNavigate } from "react-router-dom";
import { Col, Layout, Row } from "antd";
import { Content, Footer } from "antd/lib/layout/layout";
import { LoginForm } from "./components/LoginForm/LoginForm";
import { useAuthContext } from "hooks/use-auth/use-auth-context";
// import getRoute, { HOME_ROUTE } from "routes";

export function LoginPage() {
  const { state, isWorking } = useAuthContext();
  const navigate = useNavigate();
  console.log("LoginPage isAuthenticated:", state.isAuthenticated);

  React.useEffect(() => {
    console.debug("LoginPage useEffect state:", state);
  }, [state]);

  React.useEffect(() => {
    console.log("LoginPage isWorking from useEffect: ", isWorking);
  }, [isWorking]);

  if (state.isAuthenticated) {
    navigate("/app/home", { replace: true });
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
