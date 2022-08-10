import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SyncOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Modal, Typography } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { useSettings } from "hooks/use-settings/use-settings";
import { useUpdateYearStats } from "hooks/use-stats/use-company-stats";
import { useUpdatePortfolioYearStatsForced } from "hooks/use-stats/use-portfolio-stats";
import { useUpdateCompanyStockPrice } from "hooks/use-stock-prices/use-stock-prices";
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
  const [errorsList, setErrorsList] = useState<string[]>([]);

  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = React.useState<CheckboxValueType[]>([]);
  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkboxes, setCheckboxes] = useState<CheckboxesProps[]>([]);
  const { data: settings } = useSettings();

  useEffect(() => {
    const tempCheckboxes = companies.map((company: ICompanyListItem) => {
      return { name: company.name, ticker: company.ticker, id: company.id };
    });
    setCheckboxes(tempCheckboxes);
  }, [companies]);

  const { mutateAsync: updateStockPrice } = useUpdateCompanyStockPrice();
  const { mutateAsync: updateCompanyStats } = useUpdateYearStats();
  const { mutateAsync: updatePortfolioStats } =
    useUpdatePortfolioYearStatsForced();

  const showModal = () => {
    setVisible(true);
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

  const getStatsForced = useCallback(
    async (companyId: number, companyName: string) => {
      setUpdateMessage(`${t("Updating stats for company")} #${companyId}`);
      try {
        await updateCompanyStats({
          companyId: +companyId,
          year: selectedYear,
          forced: updateStockPriceSwitch,
        });
        setUpdateMessage(
          `${t("Stats updated for company")}: ${companyName} ${t(
            "and year",
          )} ${selectedYear}`,
        );
        return { result: true, message: "" };
      } catch (e) {
        const message = `${t(
          "Error updating stats for company",
        )}: ${companyName} ${t("and year")} ${selectedYear}`;
        setUpdateMessage(message);
        return { result: false, message };
      }
    },
    [selectedYear, t, updateCompanyStats, updateStockPriceSwitch],
  );

  const getCompanyStockPrice = useCallback(
    async (
      companyId: number,
      companyName: string,
      itemIndex: number,
      companiesLength: number,
    ) => {
      let tempYear = selectedYear;
      if (selectedYear === "all") {
        tempYear = new Date().getFullYear().toString();
      }
      setUpdateMessage(
        `${t("Updating price for company")}: ${companyName} (${
          itemIndex + 1
        }/${companiesLength})`,
      );
      try {
        await updateStockPrice({ companyId: +companyId, year: tempYear });
        setUpdateMessage(
          `${t("Price updated for company")}: ${companyName} ${t(
            "and year",
          )} ${tempYear}`,
        );
        return { result: true, message: "" };
      } catch (e) {
        const message = `${t(
          "Error updating price for company",
        )}: ${companyName} ${t("and year")} ${t(tempYear)}`;
        setUpdateMessage(message);
        return { result: false, message };
      }
    },
    [selectedYear, t, updateStockPrice],
  );

  const updatePortfolioStatsForced = useCallback(async () => {
    setUpdateMessage(
      `${t("Updating stats for portfolio")} #${id} ${t("and year")} ${t(
        selectedYear,
      )}`,
    );
    try {
      await updatePortfolioStats({ portfolioId: +id!, year: selectedYear });
      setUpdateMessage(
        `${t("Stats updated for portfolio")} #${id} ${t("and year")} ${t(
          selectedYear,
        )}`,
      );
    } catch (e) {
      setUpdateMessage(
        `${t("Error updating stats for portfolio")} #${id} ${t("and year")} ${t(
          selectedYear,
        )}`,
      );
    }
  }, [t, id, selectedYear, updatePortfolioStats]);

  const handleOk = async () => {
    setConfirmLoading(true);
    setErrorsList([]);
    const updatesErrorList: string[] = [];
    if (updateStockPriceSwitch) {
      console.log("Will update stock price");
      await asyncForEach(
        checkedList,
        async (companyId: number, index: number) => {
          const companyName = checkboxes.filter(
            (company) => company.id === companyId,
          )[0].name;
          console.log(`Company name: ${companyName}`);

          const result = await getCompanyStockPrice(
            companyId,
            companyName,
            index,
            checkedList.length,
          );
          if (!result.result) {
            updatesErrorList.push(result.message);
          }
        },
      );
      setConfirmLoading(false);
    }
    if (updateStatsSwitch) {
      setConfirmLoading(true);
      await asyncForEach(checkedList, async (companyId: number) => {
        const companyName = checkboxes.filter(
          (company) => company.id === companyId,
        )[0].name;
        console.log(`updateStatsSwitch: Company name: ${companyName}`);

        const result = await getStatsForced(companyId, companyName);
        if (!result.result) {
          updatesErrorList.push(result.message);
        }
      });
      setErrorsList(updatesErrorList);
      setConfirmLoading(false);
    }
    await updatePortfolioStatsForced();
    setConfirmLoading(false);
    onCheckAllChange({ target: { checked: false } });
    setUpdateStockPriceSwitch(false);
    setUpdateStatsSwitch(false);
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
        title={`${t("Refresh stats and stock prices for")} &quot;${t(
          selectedYear,
        )}&quot;`}
        visible={visible}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText={`${t("Update stats")}`}
        cancelText={`${t("Close")}`}
        onOk={handleFormSubmit}
        cancelButtonProps={{ disabled: confirmLoading }}
        closable={!confirmLoading}
      >
        <Form form={form} layout="vertical">
          {t("For each company:")}
          {settings && settings.allowFetch && (
            <Form.Item
              name="updateStockPrice"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox onChange={onStockPriceChange}>
                {t("Update the stock price from API")}
              </Checkbox>
            </Form.Item>
          )}
          <Form.Item name="updateStats" valuePropName="checked">
            <Checkbox onChange={onStatsChange}>
              {t("Update the stats for the year")} &quot;{t(selectedYear)}&quot;
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
              {checkboxes.map((company: CheckboxesProps) => (
                <div key={company.id}>
                  <Checkbox value={company.id}>
                    {company.ticker} - {company.name}
                  </Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </Form.Item>
          <Typography.Paragraph>{updateMessage}</Typography.Paragraph>
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
        </Form>
      </Modal>
    </>
  );
}
