import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import {
  BankOutlined,
  BarcodeOutlined,
  ClusterOutlined,
  DollarCircleOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { Badge, Col, Descriptions, Row, Image } from "antd";
import type { DescriptionsProps } from "antd";

interface Props {
  companyTicker: string;
  companySectorName: string;
  companySuperSectorName?: string;
  marketName: string;
  currencyCode: string;
  dividendsCurrencyCode: string;
  companyUrl: string;
  isin: string;
  companyLogo?: string;
}

export default function CompanyInfo({
  companyTicker,
  companySectorName,
  companySuperSectorName,
  marketName,
  currencyCode,
  dividendsCurrencyCode,
  companyUrl,
  companyLogo,
  isin,
}: Props): ReactElement {
  const { t } = useTranslation();

  const items: DescriptionsProps["items"] = [
    {
      key: "0",
      label: (
        <strong>
          <Badge count={<ClusterOutlined />} /> {t("Ticker")}
        </strong>
      ),
      children: companyTicker,
    },
    {
      key: "1",
      label: (
        <strong>
          <Badge count={<ClusterOutlined />} /> {t("Sector")}
        </strong>
      ),
      children: `${t(companySectorName)}
      ${companySuperSectorName && ` - ${t(companySuperSectorName)}`}`,
    },
    {
      key: "2",
      label: (
        <strong>
          <Badge count={<BankOutlined />} /> {t("Market")}{" "}
        </strong>
      ),
      children: marketName,
    },
    {
      key: "3",
      label: (
        <strong>
          <Badge count={<BarcodeOutlined />} /> {t("ISIN")}
        </strong>
      ),
      children: isin,
    },
    {
      key: "4",
      label: (
        <strong>
          <Badge count={<DollarCircleOutlined />} /> {t("Base currency")}
        </strong>
      ),
      children: currencyCode,
    },
    {
      key: "5",
      label: (
        <strong>
          <Badge count={<DollarCircleOutlined />} /> {t("Dividends currency")}
        </strong>
      ),
      children: dividendsCurrencyCode,
    },
    {
      key: "6",
      label: (
        <strong>
          <LinkOutlined />
        </strong>
      ),
      children: (
        <a href={companyUrl} target="_blank" rel="noopener noreferrer">
          {t("Company Website")}
        </a>
      ),
    },
  ];

  return (
    <Row>
      <Col lg={{ span: 18 }} xs={{ span: 24 }}>
        <Descriptions items={items} />
      </Col>
      <Col lg={{ span: 6 }} xs={{ span: 24 }}>
        <Image width={200} src={companyLogo} />
      </Col>
    </Row>
  );
}

CompanyInfo.defaultProps = {
  companySuperSectorName: "",
  companyLogo: undefined,
};
