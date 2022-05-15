import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import {
  BankOutlined,
  BarcodeOutlined,
  ClusterOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { Badge, Descriptions } from "antd";

interface Props {
  companySectorName: string;
  companySuperSectorName?: string;
  marketName: string;
  currencyCode: string;
  dividendsCurrencyCode: string;
  isin: string;
}

export default function CompanyInfo({
  companySectorName,
  companySuperSectorName,
  marketName,
  currencyCode,
  dividendsCurrencyCode,
  isin,
}: Props): ReactElement {
  const { t } = useTranslation();
  return (
    <Descriptions size="small" column={3}>
      <Descriptions.Item
        label={
          <strong>
            <Badge count={<ClusterOutlined />} /> {t("Sector")}
          </strong>
        }
      >
        {companySectorName}
        {companySuperSectorName && ` - ${companySuperSectorName}`}
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <strong>
            <Badge count={<BankOutlined />} /> {t("Market")}
          </strong>
        }
      >
        {marketName}
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <strong>
            <Badge count={<BarcodeOutlined />} /> {t("ISIN")}
          </strong>
        }
      >
        {isin}
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <strong>
            <Badge count={<DollarCircleOutlined />} /> {t("Base currency")}
          </strong>
        }
      >
        {currencyCode}
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <strong>
            <Badge count={<DollarCircleOutlined />} /> {t("Dividends currency")}
          </strong>
        }
      >
        {dividendsCurrencyCode}
      </Descriptions.Item>
    </Descriptions>
  );
}

CompanyInfo.defaultProps = {
  companySuperSectorName: "",
};
