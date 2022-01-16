import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table } from "antd";
import { AlertMessagesContext } from "contexts/alert-messages";
import { useSectors, useDeleteSector } from "hooks/use-sectors/use-sectors";
import getRoute, { SECTORS_ROUTE } from "routes";
import { ISector } from "types/sector";

export default function SuperSectorsTable() {
  const { t } = useTranslation();
  const { createError, createSuccess } = useContext(AlertMessagesContext);
  const { status, data, error, isFetching } = useSectors(true);
  const { mutateAsync: deleteSector } = useDeleteSector(true);

  const confirmDelete = async (recordId: number) => {
    try {
      await deleteSector(recordId);
      createSuccess(t("Super sector deleted successfully"));
    } catch (err) {
      createError(t(`Error deleting super sector: ${err}`));
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
      title: t("Action"),
      key: "action",
      render: (text: string, record: any) => (
        <Space size="middle">
          <Link to={`${getRoute(SECTORS_ROUTE)}/super/${record.id}`}>
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
    return data.map((element: ISector) => ({
      id: element.id,
      key: element.id,
      name: element.name,
      color: element.color,
      isSuperSector: element.isSuperSector,
      superSector: element.superSector,
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
