import React, { ReactElement } from "react";
// import { useTranslation } from "react-i18next";
import { Typography } from "antd";
import CountryFlag from "components/CountryFlag/CountryFlag";

interface Props {
  companySectorName: string;
  companySuperSectorName?: string;
  companyDescription: string;
  companyCountryCode: string;
}

export default function CompanyInfo({
  companySectorName,
  companySuperSectorName,
  companyDescription,
  companyCountryCode
}: Props): ReactElement {
  // const { Title } = Typography;
  // const { t } = useTranslation();
  console.log("companySectorName", companySectorName);
  console.log("companySuperSectorName", companySuperSectorName);
  console.log("companyDescription", companyDescription);

  return (
    <Typography.Paragraph>
      <Typography.Title level={5}>
        {companyCountryCode && (
          <CountryFlag code={companyCountryCode} key={companyCountryCode} />
        )}{" "}
        {companySectorName}{" "}
        {companySuperSectorName ? `- ${companySuperSectorName}` : ""}
      </Typography.Title>

      <Typography.Paragraph>
        {companyDescription !== "undefined" && companyDescription !== undefined
          ? companyDescription
          : ""}
      </Typography.Paragraph>
    </Typography.Paragraph>
  );
}

CompanyInfo.defaultProps = {
  companySuperSectorName: ""
};
