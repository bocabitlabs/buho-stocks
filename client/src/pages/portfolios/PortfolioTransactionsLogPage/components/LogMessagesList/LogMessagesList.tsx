import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table } from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import {
  useDeleteLogMessages,
  useLogMessages,
} from "hooks/use-log-messages/use-log-messages";
import { ILogMessage } from "types/log-messages";

export default function LogMessagesList() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: messages } = useLogMessages(+id!);
  const { mutateAsync: deleteMessage } = useDeleteLogMessages();

  const confirmDelete = async (recordId: number) => {
    try {
      await deleteMessage({ portfolioId: +id!, logMessageId: recordId });
      toast.success(t("Log message deleted successfully"));
    } catch (error) {
      toast.error(t(`Error deleting log message: ${error}`));
    }
  };

  const columns: any = [
    {
      title: t("Type"),
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
            title={`${t("Delete message")} ${record.name}?`}
            onConfirm={() => confirmDelete(record.id)}
            okText={t("Yes")}
            cancelText={t("No")}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const getData = () => {
    return messages
      ? messages.map((element: ILogMessage) => ({
          id: element.id,
          key: element.id,
          messageType: element.messageType,
          messageText: element.messageText,
          dateCreated: element.dateCreated,
        }))
      : [];
  };

  return (
    <Table columns={columns} dataSource={getData()} style={{ marginTop: 16 }} />
  );
}
