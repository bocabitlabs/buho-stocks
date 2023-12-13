import { ReactElement, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Modal, Typography } from "antd";
import { useUpdatePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";

interface Props {
  id: string | undefined;
  selectedYear: string;
}

export default function StatsRefreshModal({
  id,
  selectedYear,
}: Props): ReactElement {
  const { t } = useTranslation();

  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [updateStockPriceSwitch, setUpdateStockPriceSwitch] = useState(false);

  const { mutate: updatePortfolioStats } = useUpdatePortfolioYearStats();

  const showModal = () => {
    setVisible(true);
  };

  const handleCancelButton = () => {
    setVisible(false);
  };

  const updatePortfolioStatsAction = useCallback(async () => {
    updatePortfolioStats({
      portfolioId: +id!,
      year: selectedYear,
      updateApiPrice: updateStockPriceSwitch,
      companiesIds: [],
    });
    const message = `${t("Updating portfolio stats for year")} ${t(
      selectedYear,
    )}`;
    setVisible(false);
    toast.success<string>(message);
    return { result: true, message };
  }, [t, selectedYear, updatePortfolioStats, id, updateStockPriceSwitch]);

  const onStockPriceChange = (e: any) => {
    setUpdateStockPriceSwitch(e.target.checked);
  };

  const handleFormSubmit = async () => {
    updatePortfolioStatsAction();

    setUpdateStockPriceSwitch(false);
    form.resetFields();
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
        title={`${t("Refresh stats and stock prices for")} ${t(selectedYear)}`}
        open={visible}
        onCancel={handleCancelButton}
        okText={t("Update stats")}
        cancelText={t("Close")}
        onOk={handleFormSubmit}
      >
        <Form form={form} layout="vertical">
          <Typography.Paragraph>
            {t("For each company, the stats for the year")} {t(selectedYear)}{" "}
            {t("will be updated.")}
          </Typography.Paragraph>

          <Form.Item
            name="updateStockPrice"
            valuePropName="checked"
            style={{ marginBottom: 0 }}
          >
            <Checkbox onChange={onStockPriceChange}>
              {t("Update the stock price from API")}
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
