import { Button, Form, Input, message, PageHeader } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "hooks/use-auth/use-auth-context";
import getRoute, { HOME_ROUTE } from "routes";

export const LoginForm = () => {
  const auth = useAuthContext();
  const history = useHistory();
  const { t } = useTranslation();

  const onFinish = async (values: any) => {
    console.log("Received values of form: ", values);

    const data = {
      username: "pepe",
      password: "ABCD12345!"
    };

    const username = values.username ? values.username : data.username;
    const password = values.password ? values.password : data.password;
    const response = await auth.signin(username, password);
    if(response?.error){
      message.error({ content: t(`Error ${response.statusCode}: Unable to log in`) });
      return response;
    }else{
      message.success({ content: t("You are logged in") });
      history.replace(getRoute(HOME_ROUTE));
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
          rules={[{ required: true, message: t("Please input your Username!") }]}
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
};
