import React, { ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Modal } from "antd";
import { useUpdateYearStats } from "hooks/use-stats/use-company-stats";

interface Props {
  companyId: string | undefined;
  selectedYear: string;
}

export default function StatsRefreshModal({
  companyId,
  selectedYear,
}: Props): ReactElement {
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const [updateStockPriceSwitch, setUpdateStockPriceSwitch] = useState(false);
  const [updateStatsSwitch, setUpdateStatsSwitch] = useState(false);

  const { mutate: updateStats } = useUpdateYearStats();

  const showModal = () => {
    setVisible(true);
  };

  const onStockPriceChange = (e: any) => {
    setUpdateStockPriceSwitch(e.target.checked);
  };

  const onStatsChange = (e: any) => {
    console.log("onStatsChange", e.target.checked);
    setUpdateStatsSwitch(e.target.checked);
  };

  const getStatsForced = async () => {
    updateStats({
      companyId: +companyId!,
      years: [selectedYear, "all"],
      updateApiPrice: updateStockPriceSwitch,
    });
    setVisible(false);

    toast.success<string>(t("Updating company stats..."));
    return { result: true, message: "" };
  };

  const handleOk = async () => {
    console.log("handleOk");
    if (updateStatsSwitch) {
      getStatsForced();
    }

    onStockPriceChange({ target: { checked: false } });
    onStatsChange({ target: { checked: false } });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Button
        htmlType="button"
        type="text"
        onClick={showModal}
        icon={<SyncOutlined />}
      />
      <Modal
        title={t("Refresh stats and stock prices")}
        open={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={t("Update stats")}
        cancelText={t("Close")}
      >
        <Form>
          {t("Do you want to update the stats and the stock price?")}
          <Form.Item style={{ marginBottom: 0 }}>
            <Checkbox
              onChange={onStockPriceChange}
              checked={updateStockPriceSwitch}
            >
              {t("Update the stock price from API")}
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Checkbox onChange={onStatsChange} checked={updateStatsSwitch}>
              {t("Update the stats for the year")} &quot;{t(selectedYear)}&quot;
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
