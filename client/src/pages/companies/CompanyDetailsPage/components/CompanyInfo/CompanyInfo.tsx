import React, { ReactElement } from "react";
import {
  BankOutlined,
  ClusterOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { Badge, Tag, Typography } from "antd";

interface Props {
  companySectorName: string;
  companySuperSectorName?: string;
  marketName: string;
  currencySymbol: string;
  dividendsCurrencySymbol: string;
}

export default function CompanyInfo({
  companySectorName,
  companySuperSectorName,
  marketName,
  currencySymbol,
  dividendsCurrencySymbol,
}: Props): ReactElement {
  return (
    <Typography.Paragraph>
      <Badge count={<ClusterOutlined />} /> <Tag>{companySectorName} </Tag>{" "}
      {companySuperSectorName ? <Tag>{companySuperSectorName}</Tag> : null}{" "}
      <Badge count={<BankOutlined />} /> <Tag>{marketName}</Tag>{" "}
      <Badge count={<DollarCircleOutlined />} /> <Tag>{currencySymbol}</Tag>{" "}
      <Tag>{dividendsCurrencySymbol}</Tag>
    </Typography.Paragraph>
  );
}

CompanyInfo.defaultProps = {
  companySuperSectorName: "",
};
