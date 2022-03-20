import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Avatar, Button, Form, Input, PageHeader } from "antd";
import { IRegistrationData } from "api/api-client";
import { useRegisterUser } from "hooks/use-auth/use-auth";

function RegisterForm() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutate: registerUser } = useRegisterUser({
    onSuccess: (response: any) => {
      if (response) {
        toast.success(t("Registration successful"));
        navigate("/app-login");
      }
    },
    onError: (error: any) => {
      toast.error(t(`Login failed: ${error}`));
    },
  });

  const onFinish = async (values: any) => {
    const devData = {
      username: "pepe",
      password: "ABCD12345!",
      password2: "ABCD12345!",
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@fakeemail.com",
    };
    const data: IRegistrationData = {
      username: values.username ? values.username : devData.username,
      password: values.password ? values.password : devData.password,
      password2: values.password2 ? values.password2 : devData.password2,
      firstName: values.firstName ? values.firstName : devData.firstName,
      lastName: values.lastName ? values.lastName : devData.lastName,
      email: values.email ? values.email : devData.email,
    };
    registerUser(data);
  };

  return (
    <Form
      layout="vertical"
      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
    >
      <PageHeader
        className="site-page-header-responsive"
        title={
          <>
            <Avatar src="/icons/android-icon-72x72.png" /> Buho Stocks
          </>
        }
        subTitle={t("Register")}
      >
        <Form.Item
          name="username"
          label={t("Username")}
          tooltip={t("What do you want others to call you?")}
          rules={[
            {
              required: true,
              message: "Please input your username!",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label={t("E-mail")}
          rules={[
            {
              type: "email",
              message: t("The input is not valid E-mail"),
            },
            {
              required: true,
              message: t("Please input your E-mail"),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label={t("Password")}
          rules={[
            {
              required: true,
              message: t("Please input your password"),
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="password2"
          label={t("Confirm Password")}
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: t("Please confirm your password"),
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    t("The two passwords that you entered do not match"),
                  ),
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="firstName"
          label={t("First Name")}
          tooltip={t("What do you want others to call you?")}
          rules={[
            {
              required: true,
              message: t("Please input your first name"),
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="lastName"
          label={t("Last name")}
          tooltip={t("What is your last name?")}
          rules={[
            {
              required: true,
              message: t("Please input your last name"),
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t("Register")}
          </Button>{" "}
          {t("Already registered?")}{" "}
          <Link to="/app-login">{t("sign in")}.</Link>
        </Form.Item>
        {(!process.env.NODE_ENV || process.env.NODE_ENV === "development") && (
          <Button onClick={onFinish}>{t("Dev register")}</Button>
        )}
      </PageHeader>
    </Form>
  );
}

export default RegisterForm;
