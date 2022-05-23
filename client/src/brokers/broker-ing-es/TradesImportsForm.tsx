import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Typography,
  Checkbox,
  InputNumber,
} from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import {
  formatINGRowForShares,
  // getCommission,
  getCompanyFromTransaction,
} from "./utils";
import { useCurrencies } from "hooks/use-currencies/use-currencies";
import { useExchangeRate } from "hooks/use-exchange-rates/use-exchange-rates";
import { useAddRightsTransaction } from "hooks/use-rights-transactions/use-rights-transactions";
import { useAddSharesTransaction } from "hooks/use-shares-transactions/use-shares-transactions";
import { ICompanyListItem } from "types/company";
import { ICurrency } from "types/currency";
import { IPortfolio } from "types/portfolio";
import { ISharesTransactionFormFields } from "types/shares-transaction";

interface IProps {
  inputData: Array<string>;
  portfolio: IPortfolio;
}

export default function TradesImportForm({
  inputData,
  portfolio,
}: IProps): ReactElement {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [formSent, setFormSent] = useState(false);
  const [commissionLoading, setCommissionLoading] = useState(false);
  const {
    companyName,
    total,
    transactionDate: initialTransactionDate,
    count: initialCount,
    price,
    transactionType,
  } = formatINGRowForShares(inputData);
  const [selectedCompany, setSelectedCompany] = useState<
    ICompanyListItem | undefined
  >(getCompanyFromTransaction(companyName, portfolio));
  const [selectedCompanyCurrency, setSelectedCompanyCurrency] = useState(
    selectedCompany?.dividendsCurrency,
  );
  const [portfolioCurrency] = useState(portfolio.baseCurrency.code);
  const [transactionDate, setTransactionDate] = useState(
    initialTransactionDate.format("YYYY-MM-DD"),
  );
  const { mutate: createSharesTransaction, isLoading: loadingShares } =
    useAddSharesTransaction();
  const { mutate: createRightsTransaction, isLoading: loadingRights } =
    useAddRightsTransaction();
  const { isFetching: currenciesLoading, data: currencies } = useCurrencies();
  const {
    isFetching: exchangeRateLoading,
    refetch,
    data: exchangeRateData,
    error: errorFetchingExchangeRate,
  } = useExchangeRate(
    selectedCompanyCurrency,
    portfolioCurrency,
    transactionDate,
  );

  const onCompanyChange = (value: number) => {
    const tempCompany = portfolio.companies.find(
      (element) => element.id === value,
    );
    if (tempCompany) {
      setSelectedCompany(tempCompany);
      setSelectedCompanyCurrency(tempCompany.dividendsCurrency);
      form.setFieldsValue({
        currency: tempCompany?.baseCurrency,
      });
    }
  };

  const fetchExchangeRate = async () => {
    if (selectedCompany && portfolio) {
      refetch();
    }
  };

  const onDateChange = (e: any) => {
    setTransactionDate(e.target.value);
  };

  const onFinish = async (values: any) => {
    console.log("Success:", values);
    if (!selectedCompany) {
      return;
    }

    const {
      count,
      commissionInCompanyCurrency,
      company,
      grossPricePerShare,
      isRightsTransaction,
      transactionType: formTransactionType,
    } = values;

    let exchangeRateValue = 1;
    if (selectedCompany.baseCurrency === portfolio.baseCurrency.code) {
      exchangeRateValue = 1;
    } else {
      exchangeRateValue = values.exchangeRate;
    }
    let formattedCommission = commissionInCompanyCurrency;
    if (formattedCommission < 0) {
      formattedCommission *= -1;
    }
    console.log(typeof grossPricePerShare);
    const grossPrice = (+grossPricePerShare).toFixed(3);
    const transaction: ISharesTransactionFormFields = {
      count,
      grossPricePerShare: Number(grossPrice),
      grossPricePerShareCurrency: selectedCompany.baseCurrency,
      totalCommission: formattedCommission.toFixed(3),
      totalCommissionCurrency: selectedCompany.baseCurrency,
      exchangeRate: exchangeRateValue,
      transactionDate,
      color: "#0066cc",
      notes: `Imported from ING-es CSV on ${moment(new Date()).format(
        "YYYY-MM-DD HH:mm:ss",
      )}`,
      company,
      type: formTransactionType,
    };
    if (isRightsTransaction) {
      createRightsTransaction({
        companyId: selectedCompany.id,
        newTransaction: transaction,
      });
      setFormSent(true);
    } else {
      createSharesTransaction({
        companyId: selectedCompany.id,
        newTransaction: transaction,
      });
      setFormSent(true);
    }
  };

  const getCommissionInCompanyCurrency = async () => {
    setCommissionLoading(true);
    if (selectedCompany && portfolio) {
      if (selectedCompany?.baseCurrency !== "EUR") {
        refetch();
      }
    }
    setCommissionLoading(false);
  };

  useEffect(() => {
    if (exchangeRateData) {
      form.setFieldsValue({
        exchangeRate: exchangeRateData.exchangeRate,
        commissionInCompanyCurrency:
          exchangeRateData.exchangeRate * total - price * initialCount,
      });
    } else if (errorFetchingExchangeRate) {
      form.setFields([
        {
          name: "exchangeRate",
          errors: [t("Unable to fetch the exchange rates for the given date")],
        },
      ]);
    }
  }, [
    errorFetchingExchangeRate,
    exchangeRateData,
    form,
    initialCount,
    price,
    t,
    total,
  ]);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      initialValues={{
        grossPricePerShare: price,
        count: initialCount,
        transactionDate: initialTransactionDate.format("YYYY-MM-DD"),
        currency: selectedCompany ? selectedCompany.baseCurrency : "",
        transactionType,
        company: selectedCompany?.id,
      }}
    >
      <Row>
        <Typography.Title level={4}>
          {inputData[1]} {companyName}
        </Typography.Title>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="count"
            label={t("Count")}
            rules={[
              { required: true, message: t("Please input the shares count") },
            ]}
            help={`${t("Received")}: ${inputData[6]}`}
          >
            <Input placeholder={t("Count")} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="grossPricePerShare"
            label={t("Gross price per share")}
            rules={[{ required: true, message: t("Please input the price") }]}
            help={`${t("Received")}: ${inputData[7]}`}
          >
            <Input placeholder={t("Gross price per share")} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="company"
            label={t("Company")}
            rules={[{ required: true, message: t("Please input the company") }]}
          >
            <Select placeholder={t("Company")} onChange={onCompanyChange}>
              {portfolio.companies.map((element) => (
                <Select.Option key={element.id} value={element.id}>
                  {element.name} ({element.ticker})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="commissionInCompanyCurrency"
            label={t("Commission in company currency")}
            rules={[
              {
                required: true,
                message: t("Please input the exchange rate"),
              },
            ]}
          >
            <InputNumber
              decimalSeparator="."
              min={0}
              step={0.001}
              style={{ width: "100%" }}
              disabled={exchangeRateLoading}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="&nbsp;">
            <Button
              disabled={
                initialTransactionDate === null ||
                selectedCompany?.baseCurrency === undefined
              }
              onClick={getCommissionInCompanyCurrency}
              loading={commissionLoading}
              title={`EUR to ${selectedCompany?.baseCurrency}`}
            >
              {t("Get commission")}
            </Button>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="currency"
            label={t("Currency")}
            rules={[
              { required: true, message: t("Please input the currency") },
            ]}
          >
            <Select placeholder={t("Currency")} loading={currenciesLoading}>
              {currencies &&
                currencies.map((element: ICurrency) => (
                  <Select.Option key={element.code} value={element.code}>
                    {element.name} ({element.code})
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="transactionDate"
            label={t("Date")}
            rules={[{ required: true, message: t("Please input the date") }]}
            help={`${t("Received")}: ${inputData[0]}`}
          >
            <Input onChange={onDateChange} placeholder={t("Date")} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="transactionType"
            label={t("Type")}
            rules={[
              { required: true, message: "Please input the transaction type" },
            ]}
          >
            <Select placeholder={t("Type")}>
              <Select.Option key="BUY" value="BUY">
                {t("Buy")}
              </Select.Option>
              <Select.Option key="SELL" value="SELL">
                {t("Sell")}
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        {selectedCompany?.dividendsCurrency !== portfolio.baseCurrency.code && (
          <>
            <Col span={6}>
              <Form.Item
                name="exchangeRate"
                label={t("Exchange rate")}
                rules={[
                  {
                    required: true,
                    message: t("Please input the exchange rate"),
                  },
                ]}
                help={
                  selectedCompany?.baseCurrency &&
                  portfolio.baseCurrency.code &&
                  `${selectedCompany?.baseCurrency} to ${portfolio.baseCurrency.code}`
                }
              >
                <InputNumber
                  decimalSeparator="."
                  min={0}
                  step={0.001}
                  style={{ width: "100%" }}
                  disabled={exchangeRateLoading}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="&nbsp;">
                <Button
                  disabled={initialTransactionDate === null || !selectedCompany}
                  onClick={fetchExchangeRate}
                  loading={exchangeRateLoading}
                  title={`${selectedCompany?.baseCurrency} to ${portfolio.baseCurrency.code}`}
                >
                  {t("Get exchange rate")}
                </Button>
              </Form.Item>
            </Col>
          </>
        )}
        <Col span={12}>
          <Form.Item
            name="isRightsTransaction"
            valuePropName="checked"
            label="&nbsp;"
          >
            <Checkbox>{t("It is a rights transaction")}</Checkbox>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="&nbsp;">
            <Button
              type="primary"
              htmlType="submit"
              disabled={formSent}
              loading={loadingShares || loadingRights}
              icon={formSent ? <CheckOutlined /> : null}
            >
              {t("Add transaction")}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
