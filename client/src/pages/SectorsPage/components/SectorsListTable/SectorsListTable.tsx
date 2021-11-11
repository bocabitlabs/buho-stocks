import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Spin, Table } from "antd";
import { useSectorsContext } from "hooks/use-sectors/use-sectors-context";
import getRoute, { SECTORS_ROUTE } from "routes";
import { ISector } from "types/sector";

export default function SectorsListTable() {
  const {
    sectors,
    isLoading,
    getAll: getSectors,
    getAllSuperSectors,
    deleteById: deleteSectorById
  } = useSectorsContext();
  const { t } = useTranslation();

  useEffect(() => {
    const getAllSectors = async () => {
      getSectors();
    };
    getAllSectors();
  }, [getSectors]);

  useEffect(() => {
    const getAllSectors = async () => {
      getAllSuperSectors();
    };
    getAllSectors();
  }, [getAllSuperSectors]);

  function confirm(recordId: number) {
    console.log(recordId);
    deleteSectorById(recordId);
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
      sorter: (a: ISector, b: ISector) => a.name.localeCompare(b.name)
    },
    {
      title: t("Super sector"),
      dataIndex: "superSector",
      key: "superSector",
      render: (text: string) => text
    },
    {
      title: t("Is super sector"),
      dataIndex: "isSuperSector",
      key: "isSuperSector",
      render: (text: string) => text
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
    return sectors.map((element: ISector) => ({
      id: element.id,
      key: element.id,
      name: element.name,
      color: element.color,
      isSuperSector: element.isSuperSector,
      superSector: element.superSector
    }));
  };

  if (isLoading) {
    return <Spin />;
  }

  return <Table columns={columns} dataSource={getData()} />;
}
