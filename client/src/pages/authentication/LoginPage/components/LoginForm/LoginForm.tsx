import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Form, Input, PageHeader } from "antd";
import { AuthContext } from "contexts/auth";
import { useLoginActions } from "hooks/use-login-actions/use-login-actions";

interface LocationState {
  from: any;
}

export function LoginForm() {
  const loginActions = useLoginActions();
  const { t } = useTranslation();
  const { state, isWorking, updateIsWorking } = useContext(AuthContext);
  const navigate = useNavigate();
  const { state: locationState } = useLocation();

  const from = (locationState as LocationState)?.from?.pathname || "/app";

  React.useEffect(() => {
    if (state.isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [state, navigate, from]);

  const onFinish = async (values: any) => {
    console.log("Received values of form: ", values);

    const data = {
      username: "pepe",
      password: "ABCD12345!",
    };
    console.log(data);
    const username = values.username ? values.username : data.username;
    const password = values.password ? values.password : data.password;
    await loginActions.signin(username, password);
    console.log("isWorking previous: ", isWorking);
    updateIsWorking();
    console.log("isWorking after: ", isWorking);
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
          {t("Or")} <Link to="/app/register">{t("register now!")}</Link>
        </Form.Item>
        {(!process.env.NODE_ENV || process.env.NODE_ENV === "development") && (
          <Button onClick={onFinish}>Dev login</Button>
        )}
      </PageHeader>
    </Form>
  );
}

export default LoginForm;
