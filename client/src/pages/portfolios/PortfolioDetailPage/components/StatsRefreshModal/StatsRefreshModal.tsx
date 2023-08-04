import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Modal, Typography } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { useUpdateYearStats } from "hooks/use-stats/use-company-stats";
import { useUpdatePortfolioYearStatsForced } from "hooks/use-stats/use-portfolio-stats";
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

  useEffect(() => {
    const tempCheckboxes = companies.map((company: ICompanyListItem) => {
      return { name: company.name, ticker: company.ticker, id: company.id };
    });
    setCheckboxes(tempCheckboxes);
  }, [companies]);

  const { mutateAsync: updateCompanyStats } = useUpdateYearStats();
  const { mutateAsync: updatePortfolioStats } =
    useUpdatePortfolioYearStatsForced();

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

  const getStatsForCompany = useCallback(
    async (
      companyId: number,
      companyName: string,
      companiesCount: number,
      currentCompany: number,
    ) => {
      setUpdateMessage(
        `${currentCompany}/${companiesCount} - ${t(
          "Updating stats for company",
        )}: ${companyName} `,
      );
      try {
        const response = await updateCompanyStats({
          companyId: +companyId,
          year: selectedYear,
          updateApiPrice: updateStockPriceSwitch,
        });
        if (response.status === 200) {
          setUpdateMessage(
            `${t("Stats updated for company")}: ${companyName} ${t(
              "and year",
            )} ${selectedYear}`,
          );
          return { result: true, message: "" };
        }
        throw new Error("Error updating stats for company");
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

  const updatePortfolioStatsAction = useCallback(async () => {
    setUpdateMessage(
      `${t("Updating stats for portfolio on year")} ${t(selectedYear)}`,
    );
    try {
      await updatePortfolioStats({
        portfolioId: +id!,
        year: selectedYear,
        updateApiPrice: updateStockPriceSwitch,
      });
      const message = `${t("Stats updated for portfolioon year")} ${t(
        selectedYear,
      )}`;
      toast.success<string>(message);
      setUpdateMessage(message);
      return { result: true, message };
    } catch (e) {
      const message = `${t("Error updating stats for portfolio on year")} ${t(
        selectedYear,
      )}`;
      setUpdateMessage(message);
      return { result: false, message };
    }
  }, [t, id, selectedYear, updatePortfolioStats, updateStockPriceSwitch]);

  const updatePorFolioStats = async () => {
    setConfirmLoading(true);
    setErrorsList([]);
    const updatesErrorList: string[] = [];

    if (updateStatsSwitch) {
      const companiesCount = checkedList.length;
      let currentCompany = 0;
      await asyncForEach(checkedList, async (companyId: number) => {
        const companyName = checkboxes.filter(
          (company) => company.id === companyId,
        )[0].name;
        try {
          const result = await getStatsForCompany(
            companyId,
            companyName,
            companiesCount,
            currentCompany,
          );
          if (!result.result) {
            updatesErrorList.push(result.message);
          }
        } catch (e) {
          updatesErrorList.push(
            `${t("Error updating stats for company")} ${companyName}: ${e}`,
          );
        }
        currentCompany += 1;
      });
      setErrorsList(updatesErrorList);
      setConfirmLoading(false);
    }
    const result = await updatePortfolioStatsAction();
    if (!result.result) {
      updatesErrorList.push(result.message);
    }
    onCheckAllChange({ target: { checked: false } });
    setUpdateStockPriceSwitch(false);
    setUpdateStatsSwitch(false);
    setConfirmLoading(false);
    if (updatesErrorList.length === 0) {
      setVisible(false);
    }
  };

  const onStockPriceChange = (e: any) => {
    setUpdateStockPriceSwitch(e.target.checked);
  };

  const onStatsChange = (e: any) => {
    setUpdateStatsSwitch(e.target.checked);
  };

  const handleFormSubmit = async () => {
    try {
      await updatePorFolioStats();
      form.resetFields();
    } catch (error) {
      console.log("Error during form submit", error);
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
        title={`${t("Refresh stats and stock prices for")} ${t(selectedYear)}`}
        open={visible}
        confirmLoading={confirmLoading}
        onCancel={handleCancelButton}
        okText={t("Update stats")}
        cancelText={t("Close")}
        onOk={handleFormSubmit}
        cancelButtonProps={{ disabled: confirmLoading }}
        closable={!confirmLoading}
      >
        {confirmLoading && (
          <Typography.Title level={4}>
            {t("Updating portfolio stats...")}
          </Typography.Title>
        )}
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
        {!confirmLoading && (
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
                {t("Update the stats for the year")} {t(selectedYear)}
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
        )}
      </Modal>
    </>
  );
}
