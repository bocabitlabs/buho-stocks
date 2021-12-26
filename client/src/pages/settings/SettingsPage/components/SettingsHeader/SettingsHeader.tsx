import React, { FC, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "antd";

const SettingsPageHeader: FC<ReactNode> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <PageHeader className="site-page-header" title={t("Settings")}>
      {children}
    </PageHeader>
  );
};

export default SettingsPageHeader;
