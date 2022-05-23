import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table, Tag } from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import {
  useDeleteLogMessages,
  useLogMessages,
} from "hooks/use-log-messages/use-log-messages";
import { ILogMessage } from "types/log-messages";

interface MessageType {
  color: string;
  text: string;
}

interface MessageTypeDict {
  [index: string]: MessageType;
}

export default function LogMessagesList() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: messages } = useLogMessages(+id!);
  const { mutate: deleteMessage } = useDeleteLogMessages();

  const getMessageValue = (messageType: string): MessageType => {
    const defaultValue = { color: "", text: messageType };
    try {
      const messagesValues: MessageTypeDict = {
        ADD_DIVIDEND: {
          color: "green",
          text: t("Added dividend"),
        },
        ADD_SHARES: {
          color: "lime",
          text: t("Added shares"),
        },
        ADD_RIGHTS: {
          color: "cyan",
          text: t("Added rights"),
        },
        CREATE_COMPANY: {
          color: "blue",
          text: t("Company created"),
        },
        DELETE_RIGHTS: {
          color: "orange",
          text: t("Rights deleted"),
        },
        DELETE_DIVIDEND: {
          color: "volcano",
          text: t("Dividend deleted"),
        },
        DELETE_SHARES: {
          color: "red",
          text: t("Shares deleted"),
        },
      };
      const foundValue = messagesValues[messageType];
      if (!foundValue) {
        return defaultValue;
      }
      return foundValue;
    } catch (e: unknown) {
      return defaultValue;
    }
  };

  const confirmDelete = async (recordId: number) => {
    deleteMessage({ portfolioId: +id!, logMessageId: recordId });
    toast.success(t("Log message deleted successfully"));
  };

  const columns: any = [
    {
      title: t("Type"),
      dataIndex: "messageType",
      key: "messageType",
      render: (messageType: string) => {
        const messageValue = getMessageValue(messageType);
        return <Tag color={messageValue.color}>{messageValue.text}</Tag>;
      },
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
