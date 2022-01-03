import React, { ReactElement } from "react";
import { Typography } from "antd";
import CountryFlag from "components/CountryFlag/CountryFlag";

interface Props {
  companySectorName: string;
  companySuperSectorName?: string;
  companyCountryCode: string;
}

export default function CompanyInfo({
  companySectorName,
  companySuperSectorName,
  companyCountryCode,
}: Props): ReactElement {
  return (
    <Typography.Paragraph>
      <Typography.Title level={5}>
        {companyCountryCode && (
          <CountryFlag code={companyCountryCode} key={companyCountryCode} />
        )}{" "}
        {companySectorName}{" "}
        {companySuperSectorName ? `- ${companySuperSectorName}` : ""}
      </Typography.Title>
    </Typography.Paragraph>
  );
}

CompanyInfo.defaultProps = {
  companySuperSectorName: "",
};
