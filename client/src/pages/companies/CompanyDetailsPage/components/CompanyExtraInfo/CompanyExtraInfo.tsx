import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { Typography } from "antd";

interface Props {
  companyDescription: string;
}

export default function CompanyInfo({
  companyDescription,
}: Props): ReactElement {
  const { t } = useTranslation();
  return (
    <Typography.Paragraph style={{ paddingTop: 16 }}>
      <Typography.Title level={5}>{t("About the company")}</Typography.Title>
      <Typography.Paragraph>
        {companyDescription !== "undefined" &&
        companyDescription !== undefined ? (
          <ReactMarkdown>{companyDescription}</ReactMarkdown>
        ) : (
          ""
        )}
      </Typography.Paragraph>
    </Typography.Paragraph>
  );
}
