import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Alert, Button, Popconfirm, Space, Table } from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import momentTz from "moment-timezone";
import CountryFlag from "components/CountryFlag/CountryFlag";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import { useDeleteMarket, useMarkets } from "hooks/use-markets/use-markets";
import { useSettings } from "hooks/use-settings/use-settings";
import MarketAddEditForm from "pages/markets/MarketsListPage/components/MarketAddEditForm/MarketAddEditForm";
import { IMarket } from "types/market";

export default function MarketsListTable() {
  const { t } = useTranslation();
  const { data: markets, error, isFetching } = useMarkets();
  const { data: settings } = useSettings();

  const { mutateAsync: deleteMarket } = useDeleteMarket();
  const [selectedMarketId, setSelectedMarketId] = useState<number | undefined>(
    undefined,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (recordId: number) => {
    setSelectedMarketId(recordId);
    setIsModalVisible(true);
  };

  const onCreate = (values: any) => {
    console.log("Received values of form: ", values);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const confirmDelete = async (recordId: number) => {
    try {
      await deleteMarket(recordId);
      toast.success(t("Market deleted successfully"));
    } catch (errorDelete) {
      toast.error(t(`Error deleting market: ${errorDelete}`));
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
      render: (text: string, record: IMarket) => (
        <Button type="link" onClick={() => showModal(record.id)}>
          {text}
        </Button>
      ),
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
      render: (text: string, record: IMarket) => {
        const originalMoment = moment(text, "HH:mm").format("YYYY-MM-DD HH:mm");
        const marketTimezone = record.timezone;
        const openTime = momentTz.tz(originalMoment, marketTimezone);
        const utcTime = openTime.clone().tz(settings?.timezone || "UTC");

        return (
          <div title={`${t("Timezone")}: ${settings?.timezone || "UTC"}`}>
            {utcTime.format("HH:mm")}
          </div>
        );
      },
    },
    {
      title: t("Closing time"),
      dataIndex: "closeTime",
      key: "closeTime",
      sorter: (a: IMarket, b: IMarket) =>
        a.closeTime.localeCompare(b.closeTime),
      render: (text: string, record: IMarket) => {
        const originalMoment = moment(text, "HH:mm").format("YYYY-MM-DD HH:mm");
        const marketTimezone = record.timezone;
        const openTime = momentTz.tz(originalMoment, marketTimezone);
        const utcTime = openTime.clone().tz(settings?.timezone || "UTC");

        return (
          <div title={`${t("Timezone")}: ${settings?.timezone || "UTC"}`}>
            {utcTime.format("HH:mm")}
          </div>
        );
      },
    },
    {
      title: t("Action"),
      key: "action",
      render: (text: string, record: any) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record.id)}
          />
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
    return (
      markets &&
      markets.map((market: IMarket) => ({
        id: market.id,
        key: market.id,
        name: market.name,
        description: market.description,
        region: market.region,
        openTime: market.openTime,
        closeTime: market.closeTime,
        color: market.color,
        timezone: market.timezone,
      }))
    );
  };

  if (isFetching) {
    return <LoadingSpin />;
  }

  if (error) {
    return (
      <Alert
        showIcon
        message="Unable to load markets"
        description={error.message}
        type="error"
      />
    );
  }

  return (
    <div>
      <Table columns={columns} dataSource={getData()} />{" "}
      <MarketAddEditForm
        title="Update market"
        okText="Update"
        marketId={selectedMarketId}
        isModalVisible={isModalVisible}
        onCreate={onCreate}
        onCancel={handleCancel}
      />
    </div>
  );
}
