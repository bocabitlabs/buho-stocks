import React, { ReactElement, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { SyncOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Modal } from "antd";
import { useSettings } from "hooks/use-settings/use-settings";
import { useUpdateYearStats } from "hooks/use-stats/use-company-stats";
import { useUpdateCompanyStockPrice } from "hooks/use-stock-prices/use-stock-prices";

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
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [updateStockPriceSwitch, setUpdateStockPriceSwitch] = useState(false);
  const [updateStatsSwitch, setUpdateStatsSwitch] = useState(false);

  const { mutateAsync: updateStockPrice } = useUpdateCompanyStockPrice();
  const { mutateAsync: updateStats } = useUpdateYearStats();
  const { data: settings } = useSettings();

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
    await updateStats({
      companyId: +companyId!,
      year: selectedYear,
      forced: updateStockPriceSwitch,
    });
  };

  const getStockPrice = useCallback(async () => {
    let tempYear = selectedYear;
    if (selectedYear === "all") {
      tempYear = new Date().getFullYear().toString();
    }
    await updateStockPrice({ companyId: +companyId!, year: tempYear });
  }, [companyId, selectedYear, updateStockPrice]);

  const handleOk = async () => {
    console.log("handleOk");
    setConfirmLoading(true);

    if (updateStockPriceSwitch) {
      await getStockPrice();
      setConfirmLoading(false);
    }
    if (updateStatsSwitch) {
      setConfirmLoading(true);
      await getStatsForced();
    }
    setConfirmLoading(false);

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
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText={t("Update stats")}
        cancelText={t("Close")}
        cancelButtonProps={{ disabled: confirmLoading }}
        closable={!confirmLoading}
      >
        <Form>
          {t("Do you want to update the stats and the stock price?")}
          {settings && settings.allowFetch && (
            <Form.Item style={{ marginBottom: 0 }}>
              <Checkbox
                onChange={onStockPriceChange}
                checked={updateStockPriceSwitch}
              >
                {t("Update the stock price from API")}
              </Checkbox>
            </Form.Item>
          )}
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
