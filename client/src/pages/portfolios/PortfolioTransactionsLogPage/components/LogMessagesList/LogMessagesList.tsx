import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Badge, Button, Group, Menu, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_Localization,
  MRT_PaginationState,
  MRT_Row,
  useMantineReactTable,
} from "mantine-react-table";
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

function MessageTypeCell({ row }: Readonly<{ row: MRT_Row<ILogMessage> }>) {
  const { t } = useTranslation();

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

  const messageType = getMessageValue(row.original.messageType);

  return (
    <span>
      <Badge color={messageType.color}>{messageType.text}</Badge>
    </span>
  );
}

export default function LogMessagesList({
  mrtLocalization,
}: Readonly<{ mrtLocalization: MRT_Localization }>) {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { id } = useParams();
  const { data, isError, isFetching, isLoading } = useLogMessages(
    +id!,
    pagination,
  );
  const [selectedMessageId, setSelectedMessageId] = useState<
    number | undefined
  >(undefined);
  const { mutate: deleteMessage } = useDeleteLogMessages();

  const [deleteModalOpen, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);

  const showDeleteModal = (recordId: number) => {
    setSelectedMessageId(recordId);
    openDeleteModal();
  };

  const confirmDelete = async (recordId: number | undefined) => {
    if (!recordId) return;
    deleteMessage({ portfolioId: +id!, logMessageId: recordId });
    setSelectedMessageId(undefined);
    closeDeleteModal();
  };

  const onDeleteCloseCallback = () => {
    closeDeleteModal();
    setSelectedMessageId(undefined);
  };

  // const columns: any = [
  //   {
  //     title: t("Type"),
  //     dataIndex: "messageType",
  //     key: "messageType",
  //     render: (messageType: string) => {
  //       const messageValue = getMessageValue(messageType);
  //       return <Badge color={messageValue.color}>{messageValue.text}</Badge>;
  //     },
  //   },
  //   {
  //     title: t("Date"),
  //     dataIndex: "dateCreated",
  //     key: "dateCreated",
  //     sorter: (a: ILogMessage, b: ILogMessage) =>
  //       a.dateCreated.localeCompare(b.dateCreated),
  //     render: (text: string) =>
  //       moment(new Date(text)).format("DD/MM/YYYY HH:mm:ss"),
  //   },
  //   {
  //     title: t("Text"),
  //     dataIndex: "messageText",
  //     key: "messageText",
  //   },
  //   {
  //     title: t("Action"),
  //     key: "action",
  //     render: (text: string, record: any) => (
  //       <Space size="middle">
  //         <Popconfirm
  //           key={`market-delete-${record.key}`}
  //           title={`${t("Delete message")} ${record.name}?`}
  //           onConfirm={() => confirmDelete(record.id)}
  //           okText={t("Yes")}
  //           cancelText={t("No")}
  //         >
  //           <Button danger icon={<DeleteOutlined />} />
  //         </Popconfirm>
  //       </Space>
  //     ),
  //   },
  // ];
  // const getData = () => {
  //   return messages
  //     ? messages.map((element: ILogMessage) => ({
  //         id: element.id,
  //         key: element.id,
  //         messageType: element.messageType,
  //         messageText: element.messageText,
  //         dateCreated: element.dateCreated,
  //       }))
  //     : [];
  // };

  const columns = useMemo<MRT_ColumnDef<ILogMessage>[]>(
    () => [
      {
        accessorKey: "messageType",
        header: "",
        Cell: MessageTypeCell,
      },
      {
        accessorKey: "dateCreated",
        header: t("Date"),
      },
      {
        accessorKey: "messageText",
        header: t("Message"),
      },
    ],
    [t],
  );

  const fetchedSectors = data?.results ?? [];
  const totalRowCount = data?.count ?? 0;

  const table = useMantineReactTable({
    columns,
    data: fetchedSectors, // must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActionMenuItems: ({ row }) => (
      <Menu.Item onClick={() => showDeleteModal(row.original.id)}>
        {t("Delete")}
      </Menu.Item>
    ),
    rowCount: totalRowCount,
    manualPagination: true,
    mantineToolbarAlertBannerProps: isError
      ? {
          color: "red",
          children: "Error loading data",
        }
      : undefined,
    onPaginationChange: setPagination,
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
    },
    localization: mrtLocalization,
  });

  return (
    <div>
      <MantineReactTable table={table} />
      <Modal
        opened={deleteModalOpen}
        onClose={closeDeleteModal}
        title={t("Delete message")}
      >
        {t("Are you sure you want to delete this message?")}
        <Group>
          <Button
            disabled={!selectedMessageId}
            onClick={() => confirmDelete(selectedMessageId)}
          >
            {t("Yes")}
          </Button>
          <Button onClick={onDeleteCloseCallback}>{t("No")}</Button>
        </Group>
      </Modal>
    </div>
  );
}
