import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SyncOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Modal, Typography } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { useUpdateYearStatsForced } from "hooks/use-stats/use-company-stats";
import { useUpdatePortfolioYearStatsForced } from "hooks/use-stats/use-portfolio-stats";
import { useUpdateCompanyStockPrice } from "hooks/use-stock-prices/use-stock-prices";
import { ICompanyListItem } from "types/company";

interface Props {
  id: string | undefined;
  selectedYear: string | undefined;
  companies: ICompanyListItem[];
}

async function asyncForEach(array: any[], callback: Function) {
  for (let index = 0; index < array.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[index], index, array);
  }
}

export default function StatsRefreshModal({
  id,
  selectedYear,
  companies,
}: Props): ReactElement {
  const { t } = useTranslation();

  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [updateStockPriceSwitch, setUpdateStockPriceSwitch] = useState(false);
  const [updateStatsSwitch, setUpdateStatsSwitch] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = React.useState<CheckboxValueType[]>([]);
  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkboxes, setCheckboxes] = useState<CheckboxValueType[]>([]);

  useEffect(() => {
    const tempCheckboxes = companies.map((company: ICompanyListItem) => {
      return `${company.name} (${company.ticker}) - #${company.id}`;
    });
    setCheckboxes(tempCheckboxes);
  }, [companies]);

  const { mutateAsync: updateStockPrice } = useUpdateCompanyStockPrice();
  const { mutateAsync: updateCompanyStats } = useUpdateYearStatsForced();
  const { mutateAsync: updatePortfolioStats } =
    useUpdatePortfolioYearStatsForced();

  const showModal = () => {
    setVisible(true);
  };

  const getStatsForced = useCallback(
    async (companyId: string) => {
      setUpdateMessage(`${t("Updating stats for company")} #${companyId}`);
      try {
        await updateCompanyStats({ companyId: +companyId, year: selectedYear });
        setUpdateMessage(
          `${t(
            "Stats updated for company",
          )} #${companyId} and year ${selectedYear}`,
        );
      } catch (e) {
        setUpdateMessage(
          `${t("Error updating stats for company")} #${companyId} ${t(
            "and year",
          )} ${selectedYear}`,
        );
      }
    },
    [selectedYear, t, updateCompanyStats],
  );

  const getStockPrice = useCallback(
    async (companyId: string) => {
      let tempYear = selectedYear;
      if (selectedYear === "all") {
        tempYear = new Date().getFullYear().toString();
      }
      setUpdateMessage(`${t("Updating price for company")} #${companyId}`);
      try {
        await updateStockPrice({ companyId: +companyId, year: tempYear });
        setUpdateMessage(
          `${t("Price updated for company")} #${companyId} ${t(
            "and year",
          )} ${tempYear}`,
        );
      } catch (e) {
        setUpdateMessage(
          `${t("Error updating price for company")} #${companyId} ${t(
            "and year",
          )} ${tempYear}`,
        );
      }
    },
    [selectedYear, t, updateStockPrice],
  );

  const updatePortfolioStatsForced = useCallback(async () => {
    setUpdateMessage(
      `${t("Updating stats for portfolio")} #${id} ${t(
        "and year",
      )} ${selectedYear}`,
    );
    try {
      await updatePortfolioStats({ portfolioId: +id!, year: selectedYear });
      setUpdateMessage(
        `${t("Stats updated for portfolio")} #${id} ${t(
          "and year",
        )} ${selectedYear}`,
      );
    } catch (e) {
      setUpdateMessage(
        `${t("Error updating stats for portfolio")} #${id} ${t(
          "and year",
        )} ${selectedYear}`,
      );
    }
  }, [t, id, selectedYear, updatePortfolioStats]);

  const handleOk = async () => {
    setConfirmLoading(true);
    let companyId;
    if (updateStockPriceSwitch) {
      await asyncForEach(checkedList, async (checkboxName: string) => {
        // eslint-disable-next-line prefer-destructuring
        companyId = checkboxName.split("-")[1].split("#")[1];
        await getStockPrice(companyId);
      });
      setConfirmLoading(false);
    }
    if (updateStatsSwitch) {
      setConfirmLoading(true);
      await asyncForEach(checkedList, async (checkboxName: string) => {
        // eslint-disable-next-line prefer-destructuring
        companyId = checkboxName.split("-")[1].split("#")[1];
        await getStatsForced(companyId);
      });
      setConfirmLoading(false);
    }
    await updatePortfolioStatsForced();
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onStockPriceChange = (e: any) => {
    setUpdateStockPriceSwitch(e.target.checked);
  };

  const onStatsChange = (e: any) => {
    setUpdateStatsSwitch(e.target.checked);
  };

  const onCheckAllChange = (e: any) => {
    setCheckedList(e.target.checked ? checkboxes : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const onChange = (checkedValue: CheckboxValueType[]) => {
    setCheckedList(checkedValue);
    setIndeterminate(
      !!checkedValue.length && checkedValue.length < checkboxes.length,
    );
    setCheckAll(checkedValue.length === checkboxes.length);
  };

  const handleFormSubmit = async () => {
    try {
      await handleOk();
      form.resetFields();
    } catch (error) {
      console.log("Validate Failed:", error);
    }
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
        title={`${t("Refresh stats and stock prices for")} ${selectedYear}`}
        visible={visible}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText={`${t("Update stats")}`}
        cancelText={`${t("Close")}`}
        onOk={handleFormSubmit}
      >
        <Form form={form} layout="vertical">
          {t("For each company:")}
          <Form.Item
            name="updateStockPrice"
            valuePropName="checked"
            style={{ marginBottom: 0 }}
          >
            <Checkbox onChange={onStockPriceChange}>
              {t("Update the stock price from API")}
            </Checkbox>
          </Form.Item>
          <Form.Item name="updateStats" valuePropName="checked">
            <Checkbox onChange={onStatsChange}>
              {t("Update the stats for the year")} {selectedYear}
            </Checkbox>
          </Form.Item>
          <Typography.Title level={5}>
            {t("Select the companies to update")}
          </Typography.Title>
          <Form.Item>
            <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
            >
              {t("Check all")}
            </Checkbox>
          </Form.Item>
          <Form.Item
            name="companies"
            style={{ marginBottom: 10 }}
            valuePropName="checked"
          >
            <Checkbox.Group onChange={onChange} value={checkedList}>
              {checkboxes.map((company, index: number) => (
                <div key={index.toString()}>
                  <Checkbox value={company}>{company}</Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </Form.Item>
          <Typography.Paragraph>{updateMessage}</Typography.Paragraph>
        </Form>
      </Modal>
    </>
  );
}
