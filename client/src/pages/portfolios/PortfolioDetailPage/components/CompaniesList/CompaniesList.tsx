import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { Avatar, Table, Tag, Typography } from "antd";
import CompanyAddEditForm from "pages/companies/CompanyDetailsPage/components/CompanyAddEditForm/CompanyAddEditForm";
import { ICompanyListItem } from "types/company";
import { ICurrency } from "types/currency";

interface IProps {
  companies: ICompanyListItem[];
  portfolioBaseCurrency: ICurrency;
  isFetching: boolean;
}

export default function CompaniesList({
  companies,
  portfolioBaseCurrency,
  isFetching,
}: IProps) {
  const { t } = useTranslation();
  const { id } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const onCreate = (values: any) => {
    console.log("Received values of form: ", values);
    setIsModalVisible(false);
  };

  const onCancel = () => {
    setIsModalVisible(false);
  };

  const columns: any = [
    {
      title: "",
      dataIndex: "logo",
      key: "logo",
      render: (text: string) => <Avatar src={text} />,
      fixed: "left",
    },
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      render: (text: string, record: ICompanyListItem) => (
        <>
          <Link to={`companies/${record.id}`}>{text}</Link>
          {record.sector !== null && (
            <>
              <br />
              <Typography.Text
                type="secondary"
                style={{ fontSize: "0.8em" }}
                title={record.sectorName}
              >
                {t(record.sectorName)}
              </Typography.Text>
            </>
          )}
        </>
      ),
      sorter: (a: ICompanyListItem, b: ICompanyListItem) =>
        a.name.localeCompare(b.name),
      fixed: "left",
    },
    {
      title: t("Ticker"),
      dataIndex: "ticker",
      key: "ticker",
      sorter: (a: ICompanyListItem, b: ICompanyListItem) =>
        a.ticker.localeCompare(b.ticker),
    },
    {
      title: t("Shares"),
      dataIndex: "sharesCount",
      key: "sharesCount",
      sorter: (a: any, b: any) => +a.sharesCount - +b.sharesCount,
    },
    {
      title: t("Broker"),
      dataIndex: "broker",
      key: "broker",
      sorter: (a: ICompanyListItem, b: ICompanyListItem) =>
        a.broker.localeCompare(b.broker),
      responsive: ["md"],
    },
    {
      title: t("Invested"),
      dataIndex: "accumulatedInvestment",
      key: "accumulatedInvestment",
      render: (text: string) => (
        <>
          {(+text).toFixed(2)}
          <br />
          <Typography.Text
            type="secondary"
            style={{ fontSize: "0.8em" }}
            title={portfolioBaseCurrency.code}
          >
            {t(portfolioBaseCurrency.code)}
          </Typography.Text>
        </>
      ),
      sorter: (a: any, b: any) =>
        +a.accumulatedInvestment - +b.accumulatedInvestment,
    },
    {
      title: t("Portfolio value"),
      dataIndex: "portfolioValue",
      key: "portfolioValue",
      render: (text: string) => (
        <>
          {(+text).toFixed(2)}
          <br />
          <Typography.Text
            type="secondary"
            style={{ fontSize: "0.8em" }}
            title={portfolioBaseCurrency.code}
          >
            {t(portfolioBaseCurrency.code)}
          </Typography.Text>
        </>
      ),
      sorter: (a: any, b: any) => +a.portfolioValue - +b.portfolioValue,
    },
    {
      title: t("Return + dividends"),
      dataIndex: "returnWithDividendsPercent",
      key: "returnWithDividendsPercent",
      render: (text: string) => (
        <Typography.Text type={Number(text) < 0 ? "danger" : "success"}>
          {(+text).toFixed(2)} %
        </Typography.Text>
      ),
      sorter: (a: any, b: any) =>
        +a.returnWithDividendsPercent - +b.returnWithDividendsPercent,
    },
    {
      title: t("Dividends yield"),
      dataIndex: "dividendsYield",
      key: "dividendsYield",
      render: (text: string) => (
        <Typography.Text type={Number(text) < 0 ? "danger" : "success"}>
          {(+text).toFixed(2)} %
        </Typography.Text>
      ),
      sorter: (a: any, b: any) => +a.dividendsYield - +b.dividendsYield,
    },
    {
      title: t("Last buy"),
      dataIndex: "lastTransactionMonth",
      key: "lastTransactionMonth",
      render: (text: string) => <Tag>{text}</Tag>,
      sorter: (a: ICompanyListItem, b: ICompanyListItem) => {
        return (
          Date.parse(b.lastTransactionMonth) -
          Date.parse(a.lastTransactionMonth)
        );
      },
    },
    {
      title: t("Last dividend"),
      dataIndex: "lastDividendMonth",
      key: "lastDividendMonth",
      render: (text: string) => <Tag>{text}</Tag>,
      sorter: (a: ICompanyListItem, b: ICompanyListItem) => {
        return (
          Date.parse(b.lastDividendMonth) - Date.parse(a.lastDividendMonth)
        );
      },
    },
  ];
  const getData = () => {
    return companies.map((element: ICompanyListItem) => ({
      id: element.id,
      key: element.id,
      name: element.name,
      ticker: element.ticker,
      sharesCount: element.allStats ? element.allStats?.sharesCount : 0,
      description: element.description,
      dividendsYield: element.allStats ? element.allStats.dividendsYield : 0,
      color: element.color,
      portfolio: element.portfolio,
      logo: element.logo,
      countryCode: element.countryCode,
      sector: element.sector,
      sectorName: element.sectorName,
      broker: element.broker,
      baseCurrency: element.baseCurrency,
      accumulatedInvestment: element.allStats
        ? element.allStats.accumulatedInvestment
        : 0,
      portfolioValue: element.allStats ? element.allStats.portfolioValue : 0,
      returnWithDividendsPercent: element.allStats
        ? element.allStats.returnWithDividendsPercent
        : 0,
      portfolioCurrency: element.allStats
        ? element.allStats.portfolioCurrency
        : 0,
      lastTransactionMonth: element.lastTransactionMonth
        ? element.lastTransactionMonth
        : "",
      lastDividendMonth: element.lastDividendMonth
        ? element.lastDividendMonth
        : "",
    }));
  };

  return (
    <div>
      <Table
        loading={!companies || isFetching}
        pagination={{ defaultPageSize: 60 }}
        columns={columns}
        size="small"
        dataSource={getData()}
        scroll={{ x: 600 }}
        style={{ marginTop: 16 }}
      />
      <CompanyAddEditForm
        title="Update company"
        okText="Update"
        portfolioId={+id!}
        isModalVisible={isModalVisible}
        onCreate={onCreate}
        onCancel={onCancel}
      />
    </div>
  );
}
