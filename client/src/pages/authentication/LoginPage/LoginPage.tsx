import React from "react";
import { Card, Col, Layout, Row } from "antd";
import { Content } from "antd/lib/layout/layout";
import { LoginForm } from "./components/LoginForm/LoginForm";
import PageFooter from "components/PageFooter/PageFooter";

export function LoginPage() {
  /*   const { state } = useContext(AuthContext);
  const navigate = useNavigate(); */

  /* useEffect(() => {
    if (state.isAuthenticated) {
      navigate("/app/home", { replace: true });
    }
  }, [state.isAuthenticated, navigate]); */

  return (
    <Layout>
      <Row>
        <Col xs={{ span: 24, offset: 0 }} lg={{ span: 12, offset: 6 }}>
          <Content style={{ padding: "40px 50px" }}>
            <Card>
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
