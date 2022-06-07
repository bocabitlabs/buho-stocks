import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Input, PageHeader } from "antd";
import { AuthContext } from "contexts/auth";
import { useLoginUser } from "hooks/use-auth/use-auth";

interface LocationState {
  from: any;
}

export function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const { state: authState, authenticate } = useContext(AuthContext);

  const from = (locationState as LocationState)?.from?.pathname || "/app";

  const { mutate: loginUser } = useLoginUser({
    onSuccess: (response: any) => {
      if (response) {
        authenticate(response.data.token);
        toast.success(t("Login successful"));
        navigate("/app/home");
      }
    },
    onError: (error: any) => {
      toast.error(t(`Login failed: ${error}`));
    },
  });

  React.useEffect(() => {
    if (authState.isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [authState.isAuthenticated, navigate, from]);

  const onFinish = async (values: any) => {
    const testData = {
      username: "pepe",
      password: "ABCD12345!",
    };
    const username = values.username ? values.username : testData.username;
    const password = values.password ? values.password : testData.password;
    loginUser({ username, password });
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
        title={
          <>
            <Avatar src="/icons/android-icon-72x72.png" /> Buho Stocks
          </>
        }
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
          <div>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              {t("Sign in")}
            </Button>{" "}
            {t("Or")} <Link to="/app-register">{t("register")}</Link>
          </div>
        </Form.Item>
        {(!process.env.NODE_ENV || process.env.NODE_ENV === "development") && (
          <Button onClick={onFinish}>Dev login</Button>
        )}
      </PageHeader>
    </Form>
  );
}

export default LoginForm;
