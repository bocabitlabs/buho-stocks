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
  const [form] = Form.useForm();

  const [visible, setVisible] = useState(false);
  const [updateStockPriceSwitch, setUpdateStockPriceSwitch] = useState(false);

  const { mutate: updateStats } = useUpdateYearStats();

  const showModal = () => {
    setVisible(true);
  };

  const onStockPriceChange = (e: any) => {
    setUpdateStockPriceSwitch(e.target.checked);
  };

  const updateCompanyStatsAction = async () => {
    updateStats({
      companyId: +companyId!,
      year: selectedYear,
      updateApiPrice: updateStockPriceSwitch,
    });
    const message = `${t("Updating company stats for year")} ${t(
      selectedYear,
    )}`;
    setVisible(false);
    toast.success<string>(message);

    return { result: true, message: "" };
  };

  const handleFormSubmit = async () => {
    updateCompanyStatsAction();

    setUpdateStockPriceSwitch(false);
    form.resetFields();
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
        onOk={handleFormSubmit}
        onCancel={handleCancel}
        okText={t("Update stats")}
        cancelText={t("Close")}
      >
        <Form form={form} layout="vertical">
          {t("Do you want to update the stats and the stock price?")}
          <Form.Item style={{ marginBottom: 0 }}>
            <Checkbox
              onChange={onStockPriceChange}
              checked={updateStockPriceSwitch}
            >
              {t("Update the stock price from API")}
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
