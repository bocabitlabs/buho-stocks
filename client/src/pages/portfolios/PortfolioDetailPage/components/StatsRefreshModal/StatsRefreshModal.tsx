import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Modal, Typography } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { useUpdatePortfolioYearStats } from "hooks/use-stats/use-portfolio-stats";
import { ICompanyListItem } from "types/company";

interface Props {
  id: string | undefined;
  selectedYear: string;
  companies: ICompanyListItem[];
}

interface CheckboxesProps {
  id: number;
  name: string;
  ticker: string;
}

export default function StatsRefreshModal({
  id,
  selectedYear,
  companies,
}: Props): ReactElement {
  const { t } = useTranslation();

  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [updateStockPriceSwitch, setUpdateStockPriceSwitch] = useState(false);

  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = React.useState<CheckboxValueType[]>([]);
  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkboxes, setCheckboxes] = useState<CheckboxesProps[]>([]);

  useEffect(() => {
    const tempCheckboxes = companies.map((company: ICompanyListItem) => {
      return { name: company.name, ticker: company.ticker, id: company.id };
    });
    setCheckboxes(tempCheckboxes);
  }, [companies]);

  const { mutate: updatePortfolioStats } = useUpdatePortfolioYearStats();

  const showModal = () => {
    setVisible(true);
  };

  const handleCancelButton = () => {
    setVisible(false);
  };

  const onCheckAllChange = (e: any) => {
    setCheckedList(
      e.target.checked ? checkboxes.map((company) => company.id) : [],
    );
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const onChange = (checkedValue: CheckboxValueType[]) => {
    console.log(checkedValue);
    setCheckedList(checkedValue);
    setIndeterminate(
      !!checkedValue.length && checkedValue.length < checkboxes.length,
    );
    setCheckAll(checkedValue.length === checkboxes.length);
  };

  const updatePortfolioStatsAction = useCallback(async () => {
    updatePortfolioStats({
      portfolioId: +id!,
      year: selectedYear,
      updateApiPrice: updateStockPriceSwitch,
      companiesIds: checkedList.map((item) => +item),
    });
    const message = `${t("Updating portfolio stats for year")} ${t(
      selectedYear,
    )}`;
    setVisible(false);
    toast.success<string>(message);
    return { result: true, message };
  }, [
    t,
    selectedYear,
    updatePortfolioStats,
    id,
    updateStockPriceSwitch,
    checkedList,
  ]);

  const onStockPriceChange = (e: any) => {
    setUpdateStockPriceSwitch(e.target.checked);
  };

  const handleFormSubmit = async () => {
    updatePortfolioStatsAction();

    onCheckAllChange({ target: { checked: false } });
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
            <Checkbox.Group
              onChange={onChange}
              value={checkedList}
              style={{ display: "block" }}
            >
              {checkboxes.map((company: CheckboxesProps) => (
                <div key={company.id}>
                  <Checkbox value={company.id}>
                    {company.ticker} - {company.name}
                  </Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
