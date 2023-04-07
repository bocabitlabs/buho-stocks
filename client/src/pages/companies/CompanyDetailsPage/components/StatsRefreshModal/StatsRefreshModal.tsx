import React, { ReactElement, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { SyncOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Modal, Typography } from "antd";
import axios from "axios";
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
  const [errorsList, setErrorsList] = useState<string[]>([]);

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
    try {
      await updateStats({
        companyId: +companyId!,
        year: selectedYear,
        forced: updateStockPriceSwitch,
      });
      return { result: true, message: "" };
    } catch (error: any) {
      let message = error;
      if (axios.isAxiosError(error)) {
        message = error.message;
      }
      return { result: false, message };
    }
  };

  const getStockPrice = useCallback(async () => {
    let tempYear = selectedYear;
    if (selectedYear === "all") {
      tempYear = new Date().getFullYear().toString();
    }
    try {
      await updateStockPrice({ companyId: +companyId!, year: tempYear });
      return { result: true, message: "" };
    } catch (error: any) {
      let message = error;
      if (axios.isAxiosError(error)) {
        message = error.message;
      }
      return { result: false, message };
    }
  }, [companyId, selectedYear, updateStockPrice]);

  const handleOk = async () => {
    console.log("handleOk");
    setConfirmLoading(true);
    setErrorsList([]);
    const updatesErrorList: string[] = [];

    if (updateStockPriceSwitch) {
      const result = await getStockPrice();
      if (!result.result) {
        updatesErrorList.push(result.message);
      }
      setConfirmLoading(false);
    }
    if (updateStatsSwitch) {
      setConfirmLoading(true);
      const result = await getStatsForced();
      console.log(result);
      if (!result.result) {
        updatesErrorList.push(result.message);
      }
    }
    setErrorsList(updatesErrorList);
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
        open={visible}
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
        <Typography.Paragraph type="danger">
          {errorsList.length > 0 ? (
            <ul>
              {errorsList.length &&
                errorsList.map((item: string) => (
                  <li key={encodeURI(item)}>{item}</li>
                ))}
            </ul>
          ) : (
            ""
          )}
        </Typography.Paragraph>
      </Modal>
    </>
  );
}
