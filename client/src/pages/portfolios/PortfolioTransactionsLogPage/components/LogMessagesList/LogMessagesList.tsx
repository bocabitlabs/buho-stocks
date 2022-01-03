import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table } from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import useFetch from "use-http";
import { ICompany } from "types/company";
import { ILogMessage } from "types/log-messages";

export default function LogMessagesList() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const { response, del: deleteMessage, get } = useFetch("portfolios");

  const confirmDelete = async (recordId: number) => {
    await deleteMessage(`${id}/messages/${recordId}/`);
    if (response.ok) {
      const removeItem = messages.filter((market: ICompany) => {
        return market.id !== recordId;
      });
      setMessages(removeItem);
    }
  };
  useEffect(() => {
    async function loadInitialMessages() {
      const initialPortfolio = await get(`${id}/messages/`);
      if (response.ok) setMessages(initialPortfolio);
    }
    loadInitialMessages();
  }, [response.ok, get, id]);

  const columns: any = [
    {
      title: "Type",
      dataIndex: "messageType",
      key: "messageType",
    },
    {
      title: t("Date"),
      dataIndex: "dateCreated",
      key: "dateCreated",
      sorter: (a: ILogMessage, b: ILogMessage) =>
        a.dateCreated.localeCompare(b.dateCreated),
      render: (text: string) =>
        moment(new Date(text)).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: t("Text"),
      dataIndex: "messageText",
      key: "messageText",
    },
    {
      title: t("Action"),
      key: "action",
      render: (text: string, record: any) => (
        <Space size="middle">
          <Popconfirm
            key={`market-delete-${record.key}`}
            title={`Delete message ${record.name}?`}
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
    return messages.map((element: ILogMessage) => ({
      id: element.id,
      key: element.id,
      messageType: element.messageType,
      messageText: element.messageText,
      dateCreated: element.dateCreated,
    }));
  };

  return (
    <Table columns={columns} dataSource={getData()} style={{ marginTop: 16 }} />
  );
}
