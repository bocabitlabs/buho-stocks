import { Button, Popconfirm, Space, Spin, Table } from "antd";
import React, { useEffect } from "react";
import { IMarket } from "types/market";
import { Link } from "react-router-dom";
import CountryFlag from "components/CountryFlag/CountryFlag";
import { useTranslation } from "react-i18next";
import { useMarketsContext } from "hooks/use-markets/use-markets-context";
import getRoute, { MARKETS_ROUTE } from "routes";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export default function MarketsListTable() {
  const {
    markets,
    isLoading,
    getAll: getMarkets,
    deleteById: deleteMarketById
  } = useMarketsContext();
  const { t } = useTranslation();

  useEffect(() => {
    const getAllMarkets = async () => {
      getMarkets();
    };
    getAllMarkets();
  }, [getMarkets]);

  function confirm(recordId: number) {
    console.log(recordId);
    deleteMarketById(recordId);
  }

  const columns: any = [
    {
      title: "",
      dataIndex: "color",
      key: "color",
      render: (text: string) => (
        <svg height="20" width="20">
          <circle cx="10" cy="10" r="10" fill={text} />
        </svg>
      )
    },
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      render: (text: string) => <strong>{text}</strong>,
      sorter: (a: IMarket, b: IMarket) => a.name.localeCompare(b.name)
    },
    {
      title: t("Description"),
      dataIndex: "description",
      key: "description",
      sorter: (a: IMarket, b: IMarket) =>
        a.description.localeCompare(b.description)
    },
    {
      title: t("Region"),
      dataIndex: "region",
      key: "region",
      render: (text: string) => <CountryFlag code={text} />,
      sorter: (a: IMarket, b: IMarket) => a.region.localeCompare(b.region)
    },
    {
      title: t("Opening time"),
      dataIndex: "openTime",
      key: "openTime",
      sorter: (a: IMarket, b: IMarket) => a.openTime.localeCompare(b.openTime),
      render: (text: string) => moment(text, "HH:mm").format("HH:mm")
    },
    {
      title: t("Closing time"),
      dataIndex: "closeTime",
      key: "closeTime",
      sorter: (a: IMarket, b: IMarket) =>
        a.closeTime.localeCompare(b.closeTime),
      render: (text: string) => moment(text, "HH:mm").format("HH:mm")
    },
    {
      title: t("Action"),
      key: "action",
      render: (text: string, record: any) => (
        <Space size="middle">
          <Link to={`${getRoute(MARKETS_ROUTE)}/${record.id}`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            key={`market-delete-${record.key}`}
            title={`Delete market ${record.name}?`}
            onConfirm={() => confirm(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const getData = () => {
    return markets.map((market: IMarket) => ({
      id: market.id,
      key: market.id,
      name: market.name,
      description: market.description,
      region: market.region,
      openTime: market.openTime,
      closeTime: market.closeTime,
      color: market.color
    }));
  };

  if (isLoading) {
    return <Spin />;
  }

  return (
    <>
      <Table columns={columns} dataSource={getData()} />
    </>
  );
}
