import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Spin, Table } from "antd";
import useFetch from "use-http";
import { AlertMessagesContext } from "contexts/alert-messages";
import getRoute, { SECTORS_ROUTE } from "routes";
import { ISector } from "types/sector";

export default function SectorsTable() {
  const [sectors, setSectors] = useState([]);

  const { t } = useTranslation();
  const { createError, createSuccess } = useContext(AlertMessagesContext);
  const { loading, response, get, del: deleteSector } = useFetch();

  const confirmDelete = async (recordId: number) => {
    console.log(recordId);
    await deleteSector(`${recordId}/`);
    if (response.ok) {
      createSuccess(t("Sector deleted successfully"));
      const removeItem = sectors.filter((market: ISector) => {
        return market.id !== recordId;
      });
      setSectors(removeItem);
    } else {
      createError(t("Error deleting sector"));
    }
  };

  useEffect(() => {
    async function loadInitialSectors() {
      const initialTodos = await get();
      if (response.ok) setSectors(initialTodos);
    }
    loadInitialSectors();
  }, [response.ok, get]);

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
      sorter: (a: ISector, b: ISector) => a.name.localeCompare(b.name),
    },
    {
      title: t("Super sector"),
      dataIndex: "superSector",
      key: "superSector",
      render: (text: string) => text,
    },
    {
      title: t("Is super sector"),
      dataIndex: "isSuperSector",
      key: "isSuperSector",
      render: (text: string) => text,
    },
    {
      title: t("Action"),
      key: "action",
      render: (text: string, record: any) => (
        <Space size="middle">
          <Link to={`${getRoute(SECTORS_ROUTE)}/${record.id}`}>
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
    return sectors.map((element: ISector) => ({
      id: element.id,
      key: element.id,
      name: element.name,
      color: element.color,
      isSuperSector: element.isSuperSector,
      superSector: element.superSector,
    }));
  };

  if (loading && !sectors.length) {
    return <Spin />;
  }

  return <Table columns={columns} dataSource={getData()} />;
}
