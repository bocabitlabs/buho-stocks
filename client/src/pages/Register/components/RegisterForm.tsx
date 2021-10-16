import { Button, Form, Input, PageHeader } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

const RegisterForm = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const { t } = useTranslation();

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    const devData = {
      username: "pepe",
      password: "ABCD12345!",
      password2: "ABCD12345!",
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@fakeemail.com"
    };
    const data = {
      username: values.username? values.username : devData.username,
      password: values.password? values.password: devData.password,
      password2: values.password2? values.password2: devData.password2,
      first_name: values.firstName? values.firstName: devData.firstName,
      last_name: values.lastName? values.lastName: devData.lastName,
      email: values.email? values.email: devData.email
    };

    fetch("/auth/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        history.replace("/login");
      });
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
        title="Buho Stocks"
        subTitle="Register"
      >
        <Form.Item
          name="username"
          label="Username"
          tooltip="What do you want others to call you?"
          rules={[
            {
              required: true,
              message: "Please input your username!",
              whitespace: true
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!"
            },
            {
              required: true,
              message: "Please input your E-mail!"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!"
            }
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="password2"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!"
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              }
            })
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="firstName"
          label="First Name"
          tooltip="What do you want others to call you?"
          rules={[
            {
              required: true,
              message: "Please input your first name!",
              whitespace: true
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last name"
          tooltip="What do you want others to call you?"
          rules={[
            {
              required: true,
              message: "Please input your last name!",
              whitespace: true
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button> {t("Already registered?")} <Link to="/login">sign in!</Link>
        </Form.Item>
        {(!process.env.NODE_ENV || process.env.NODE_ENV === "development") && (
          <Button onClick={onFinish}>Dev register</Button>
        )}
      </PageHeader>
    </Form>
  );
};

export default RegisterForm;
