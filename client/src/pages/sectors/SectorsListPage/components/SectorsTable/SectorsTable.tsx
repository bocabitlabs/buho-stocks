import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table } from "antd";
import { AlertMessagesContext } from "contexts/alert-messages";
import { useDeleteSector, useSectors } from "hooks/use-sectors/use-sectors";
import getRoute, { SECTORS_ROUTE } from "routes";
import { ISector } from "types/sector";

export default function SectorsTable() {
  const { t } = useTranslation();
  const { createError, createSuccess } = useContext(AlertMessagesContext);
  const { status, data: sectors, error, isFetching } = useSectors();
  const { mutateAsync: deleteSector } = useDeleteSector();

  const confirmDelete = async (recordId: number) => {
    try {
      await deleteSector(recordId);
      createSuccess(t("Sector deleted successfully"));
    } catch (err) {
      createError(t(`Error deleting sector: ${err}`));
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
      sorter: (a: ISector, b: ISector) => a.name.localeCompare(b.name),
    },
    {
      title: t("Super sector"),
      dataIndex: "superSector",
      key: "superSector",
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
            key={`sector-delete-${record.key}`}
            title={`Delete sector ${record.name}?`}
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
    return (
      sectors &&
      sectors.map((element: ISector) => ({
        id: element.id,
        key: element.id,
        name: element.name,
        color: element.color,
        superSector: element.superSector?.name,
      }))
    );
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
