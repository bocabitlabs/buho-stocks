import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Form, Input, PageHeader } from "antd";
import useFetch from "use-http";
import { AuthContext } from "contexts/auth";

interface LocationState {
  from: any;
}

export function LoginForm() {
  const { t } = useTranslation();
  const { state: authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const { post, response } = useFetch("/api/auth");

  const from = (locationState as LocationState)?.from?.pathname || "/app";

  React.useEffect(() => {
    if (authState.isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [authState.isAuthenticated, navigate, from]);

  const onFinish = async (values: any) => {
    console.log("Received values of form: ", values);

    const data = {
      username: "pepe",
      password: "ABCD12345!",
    };
    console.log(data);
    const username = values.username ? values.username : data.username;
    const password = values.password ? values.password : data.password;
    await post("api-token-auth/", { username, password });
    if (response.ok) {
      navigate(from, { replace: true });
    } else {
      console.error("Unable to login");
    }
  };

  return (
    <Form
      name="normal_login"
      layout="vertical"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <PageHeader
        className="site-page-header-responsive"
        title="Buho Stocks"
        subTitle={t("Sign in")}
      >
        <Form.Item
          name="username"
          label={t("Username")}
          rules={[
            { required: true, message: t("Please input your Username!") },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          label={t("Password")}
          rules={[{ required: true, message: t("Please input your Password") }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder={t("Password")}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            {t("Sign in")}
          </Button>{" "}
          {t("Or")} <Link to="/app-register">{t("register")}</Link>
        </Form.Item>
        {(!process.env.NODE_ENV || process.env.NODE_ENV === "development") && (
          <Button onClick={onFinish}>Dev login</Button>
        )}
      </PageHeader>
    </Form>
  );
}

export default LoginForm;
