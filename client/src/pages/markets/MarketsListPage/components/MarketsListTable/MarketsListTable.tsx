import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Table } from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import momentTz from "moment-timezone";
import CountryFlag from "components/CountryFlag/CountryFlag";
import { useMarkets } from "hooks/use-markets/use-markets";
import { useSettings } from "hooks/use-settings/use-settings";
import { IMarket } from "types/market";

export default function MarketsListTable() {
  const { t } = useTranslation();
  const { data: markets, error, isFetching } = useMarkets();
  const { data: settings } = useSettings();

  const columns: any = [
    {
      title: "#",
      dataIndex: "count",
      key: "count",
    },
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
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
  ];

  const getData = () => {
    return (
      markets &&
      markets.map((market: IMarket, index: number) => ({
        id: market.id,
        count: index + 1,
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

  if (error) {
    return (
      <Alert
        showIcon
        message={t("Unable to load markets")}
        description={error.message}
        type="error"
      />
    );
  }

  return (
    <div>
      <Table
        scroll={{ x: 600 }}
        style={{ marginTop: 16 }}
        columns={columns}
        dataSource={getData()}
        loading={isFetching}
      />
    </div>
  );
}
