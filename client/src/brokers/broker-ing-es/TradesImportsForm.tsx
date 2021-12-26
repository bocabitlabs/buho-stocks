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
  InputNumber
} from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import useFetch from "use-http";
import {
  formatINGRowForShares,
  // getCommission,
  getCompanyFromTransaction
} from "./utils";
import { ICompany } from "types/company";
import { ICurrency } from "types/currency";
import { IPortfolio } from "types/portfolio";
import { ISharesTransactionFormFields } from "types/shares-transaction";

interface IProps {
  inputData: Array<string>;
  portfolio: IPortfolio;
}

export default function TradesImportForm({
  inputData,
  portfolio
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
    transactionType
  } = formatINGRowForShares(inputData);
  const [selectedCompany, setSelectedCompany] = useState<ICompany | undefined>(
    getCompanyFromTransaction(companyName, portfolio)
  );
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const {
    loading: sharesLoading,
    post: postSharesTransaction,
    response: sharesResponse
  } = useFetch(`companies/${selectedCompany?.id}/shares`);
  const {
    loading: rightsLoading,
    post: postRightsTransaction,
    response: rightsResponse
  } = useFetch(`companies/${selectedCompany?.id}/rights`);
  const {
    loading: currenciesLoading,
    get: getCurrencies,
    response: currenciesResponse
  } = useFetch(`currencies`);
  const {
    loading: exchangeRateLoading,
    get: getExchangeRate,
    response: exchangeRateResponse
  } = useFetch("exchange-rates");

  console.log(inputData);
  console.log(portfolio);

  useEffect(() => {
    const fetchCurrencies = async () => {
      const results = await getCurrencies();
      if (currenciesResponse.ok) {
        setCurrencies(results);
      }
    };
    fetchCurrencies();
  }, [getCurrencies, currenciesResponse]);

  const onCompanyChange = (value: string) => {
    const company = getCompanyFromTransaction(value, portfolio);
    console.log("total", total);
    setSelectedCompany(company);
    form.setFieldsValue({
      currency: company?.baseCurrency.code
    });
  };

  const fetchExchangeRate = async () => {
    console.log("fetching exchange rate");
    console.log(form.getFieldValue("transactionDate"));
    if (selectedCompany && portfolio) {
      const newExchangeRate = await getExchangeRate(
        `${selectedCompany?.baseCurrency.code}/${
          portfolio?.baseCurrency.code
        }/${form.getFieldValue("transactionDate")}`
      );
      if (exchangeRateResponse.ok) {
        console.log(newExchangeRate);
        form.setFieldsValue({
          exchangeRate: newExchangeRate.exchangeRate
        });
      } else {
        form.setFields([
          {
            name: "exchangeRate",
            errors: ["Unable to fetch the exchange rates for the given date"]
          }
        ]);
      }
    }
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
      transactionDate,
      grossPricePerShare,
      isRightsTransaction
    } = values;

    let exchangeRateValue = 1;
    if (selectedCompany.baseCurrency.code === portfolio.baseCurrency.code) {
      exchangeRateValue = 1;
    } else {
      exchangeRateValue = values.exchangeRate;
    }
    let formattedCommission = commissionInCompanyCurrency;
    if (formattedCommission < 0) {
      formattedCommission *= -1;
    }
    const transaction: ISharesTransactionFormFields = {
      count,
      grossPricePerShare: grossPricePerShare.toFixed(3),
      grossPricePerShareCurrency: selectedCompany.baseCurrency.code,
      totalCommission: formattedCommission.toFixed(3),
      totalCommissionCurrency: selectedCompany.baseCurrency.code,
      exchangeRate: exchangeRateValue,
      transactionDate,
      color: "#0066cc",
      notes: `Imported from ING-es CSV on ${moment(new Date()).format(
        "YYYY-MM-DD HH:mm:ss"
      )}`,
      company,
      portfolio: portfolio.id,
      type: "BUY"
    };
    if (isRightsTransaction) {
      await postRightsTransaction("/", transaction);
      if (rightsResponse.ok) {
        setFormSent(true);
      }
    } else {
      await postSharesTransaction("/", transaction);
      if (sharesResponse.ok) {
        setFormSent(true);
      }
    }
  };

  const getCommissionInCompanyCurrency = async () => {
    setCommissionLoading(true);
    if (selectedCompany && portfolio) {
      if (selectedCompany?.baseCurrency.code === "EUR") {
        form.setFieldsValue({
          commissionInCompanyCurrency: total - price * initialCount
        });
      } else {
        const newExchangeRate = await getExchangeRate(
          `EUR/${selectedCompany?.baseCurrency.code}/${form.getFieldValue(
            "transactionDate"
          )}`
        );
        if (exchangeRateResponse.ok) {
          console.log(newExchangeRate);
          form.setFieldsValue({
            commissionInCompanyCurrency:
              newExchangeRate.exchangeRate * total - price * initialCount
          });
        } else {
          form.setFields([
            {
              name: "commissionInCompanyCurrency",
              errors: ["Unable to fetch the exchange rates for the given date"]
            }
          ]);
        }
      }
    }
    setCommissionLoading(false);
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      initialValues={{
        grossPricePerShare: price,
        count: initialCount,
        transactionDate: initialTransactionDate.format("YYYY-MM-DD"),
        currency: selectedCompany ? selectedCompany.baseCurrency.code : "",
        transactionType,
        company: selectedCompany?.name
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
              { required: true, message: t("Please input the shares count") }
            ]}
            help={`Received: ${inputData[6]}`}
          >
            <Input placeholder={t("Count")} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="grossPricePerShare"
            label={t("Price")}
            rules={[{ required: true, message: t("Please input the price") }]}
            help={`Received: ${inputData[7]}`}
          >
            <Input placeholder="Price" />
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
                <Select.Option key={element.id} value={element.name}>
                  {element.name} ({element.ticker})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="commissionInCompanyCurrency"
            label="Commission in company currency"
            rules={[
              {
                required: true,
                message: t("Please input the exchange rate")
              }
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
                selectedCompany?.dividendsCurrency.code === undefined
              }
              onClick={getCommissionInCompanyCurrency}
              loading={commissionLoading}
              title={`EUR to ${selectedCompany?.baseCurrency.code}`}
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
              { required: true, message: t("Please input the currency") }
            ]}
          >
            <Select placeholder={t("Currency")} loading={currenciesLoading}>
              {currencies.map((element: ICurrency) => (
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
            label="Date"
            rules={[{ required: true, message: "Please input the date" }]}
            help={`Received: ${inputData[0]}`}
          >
            <Input placeholder="Date" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="transactionType"
            label={t("Type")}
            rules={[
              { required: true, message: "Please input the transaction type" }
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
        {selectedCompany?.dividendsCurrency.code !==
          portfolio.baseCurrency.code && (
          <>
            <Col span={6}>
              <Form.Item
                name="exchangeRate"
                label="Exchange rate"
                rules={[
                  {
                    required: true,
                    message: t("Please input the exchange rate")
                  }
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
                  disabled={initialTransactionDate === null || !selectedCompany}
                  onClick={fetchExchangeRate}
                  loading={exchangeRateLoading}
                  title={`${selectedCompany?.baseCurrency.code} to ${portfolio.baseCurrency.code}`}
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
            <Checkbox>{t("Is a rights transaction")}</Checkbox>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="&nbsp;">
            <Button
              type="primary"
              htmlType="submit"
              disabled={formSent}
              loading={sharesLoading || rightsLoading}
              icon={formSent ? <CheckOutlined /> : null}
            >
              Add transaction
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
