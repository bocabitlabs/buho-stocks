import React, { ReactElement, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { AuthContext } from "contexts/auth";

export default function LogoutButton(): ReactElement {
  const navigate = useNavigate();
  const { clearToken } = useContext(AuthContext);
  const { t } = useTranslation();

  const signout = async () => {
    localStorage.removeItem("token");
    clearToken();
    navigate("/app-login");
  };
  return (
    <Menu.Item key="3" onClick={signout}>
      {t("Sign out")}
    </Menu.Item>
  );
}
