import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table } from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import useFetch from "use-http";
import CountryFlag from "components/CountryFlag/CountryFlag";
import { useMarkets } from "hooks/use-markets/use-markets";
import getRoute, { MARKETS_ROUTE } from "routes";
import { IMarket } from "types/market";

export default function MarketsListTable() {
  const [markets, setMarkets] = useState([]);
  const { response, del: deleteMarket } = useFetch("markets");
  const { t } = useTranslation();
  const { status, data, error, isFetching } = useMarkets();

  const confirmDelete = async (recordId: number) => {
    await deleteMarket(`${recordId}/`);
    if (response.ok) {
      const removeItem = markets.filter((market: IMarket) => {
        return market.id !== recordId;
      });
      setMarkets(removeItem);
    }
  };

  const columns: any = [
    {
      title: "",
      dataIndex: "color",
      key: "color",
      render: (text: string) => (
        <svg height="20" width="20">
          <circle cx="10" cy="10" r="10" fill={text} />
        </svg>
      ),
    },
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      render: (text: string) => <strong>{text}</strong>,
      sorter: (a: IMarket, b: IMarket) => a.name.localeCompare(b.name),
    },
    {
      title: t("Description"),
      dataIndex: "description",
      key: "description",
      sorter: (a: IMarket, b: IMarket) =>
        a.description.localeCompare(b.description),
    },
    {
      title: t("Region"),
      dataIndex: "region",
      key: "region",
      render: (text: string) => <CountryFlag code={text} />,
      sorter: (a: IMarket, b: IMarket) => a.region.localeCompare(b.region),
    },
    {
      title: t("Opening time"),
      dataIndex: "openTime",
      key: "openTime",
      sorter: (a: IMarket, b: IMarket) => a.openTime.localeCompare(b.openTime),
      render: (text: string) => moment(text, "HH:mm").format("HH:mm"),
    },
    {
      title: t("Closing time"),
      dataIndex: "closeTime",
      key: "closeTime",
      sorter: (a: IMarket, b: IMarket) =>
        a.closeTime.localeCompare(b.closeTime),
      render: (text: string) => moment(text, "HH:mm").format("HH:mm"),
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
            onConfirm={() => confirmDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const getData = () => {
    return data.map((market: IMarket) => ({
      id: market.id,
      key: market.id,
      name: market.name,
      description: market.description,
      region: market.region,
      openTime: market.openTime,
      closeTime: market.closeTime,
      color: market.color,
    }));
  };

  if (isFetching) {
    return <div>{isFetching ? <div>Fetching data...</div> : <div />}</div>;
  }

  if (error) {
    return <div>Error fetching the data from the API</div>;
  }

  if (status === "loading") {
    return <div>Loading</div>;
  }

  return <Table columns={columns} dataSource={getData()} />;
}
