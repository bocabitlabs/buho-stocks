import React, {
  ReactElement,
  useState,
  //  useContext, useState
} from "react";
import { useTranslation } from "react-i18next";
import { CheckOutlined } from "@ant-design/icons";
import {
  Row,
  Form,
  Typography,
  Col,
  Input,
  Button,
  Select,
  InputNumber,
} from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import useFetch from "use-http";
import { ICompany } from "types/company";
import { IPortfolio } from "types/portfolio";
import { ISharesTransactionFormFields } from "types/shares-transaction";

interface IProps {
  inputData: Array<string>;
  portfolio: IPortfolio;
}

export default function IBTradesImportForm({
  inputData,
  portfolio,
}: IProps): ReactElement {
  const initialCompanyCurrency = inputData[4];
  const initialCompanyTicker = inputData[5];
  const initialCount = +inputData[7];
  const initialTransactionDate = moment(inputData[6]);
  const initialGrossPricePerShare = +inputData[8];
  let initialCommission = +inputData[11];
  if (initialCommission < 0) {
    initialCommission *= -1;
  }

  const [form] = Form.useForm();
  const [formSent, setFormSent] = useState(false);
  const { t } = useTranslation();
  const [selectedCompany, setSelectedCompany] = useState<ICompany | undefined>(
    portfolio.companies.find(
      (element) => element.ticker === initialCompanyTicker,
    ),
  );
  const {
    loading: exchangeRateLoading,
    get: getExchangeRate,
    response: exchangeRateResponse,
    cache: exchangeRateCache,
  } = useFetch("exchange-rates");
  const {
    loading: sharesLoading,
    post: postSharesTransaction,
    response: sharesResponse,
    cache: sharesCache,
  } = useFetch(`companies/${selectedCompany?.id}/shares`);

  const onCompanyChange = (value: string) => {
    const tempCompany = portfolio.companies.find((element) => {
      console.log(element.id, value);
      return element.id === +value;
    });
    if (tempCompany) {
      setSelectedCompany(tempCompany);
    }
  };

  const onFinish = async (values: any) => {
    console.log("Success:", values);
    if (!selectedCompany) {
      console.error("No company selected");
      return;
    }

    const { count, commission, company, transactionDate, grossPricePerShare } =
      values;

    let exchangeRateValue = 1;
    if (selectedCompany.baseCurrency.code === portfolio.baseCurrency.code) {
      exchangeRateValue = 1;
    } else {
      exchangeRateValue = values.exchangeRate;
    }
    let formattedCommission = commission;
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
      notes: `Imported from IB CSV on ${moment(new Date()).format(
        "YYYY-MM-DD HH:mm:ss",
      )}`,
      company,
      portfolio: portfolio.id,
      type: "BUY",
    };
    console.debug(transaction);
    await postSharesTransaction("/", transaction);
    if (sharesResponse.ok) {
      setFormSent(true);
      sharesCache.clear();
    }
  };

  const fetchExchangeRate = async () => {
    console.log("fetching exchange rate");
    console.log(form.getFieldValue("transactionDate"));
    if (selectedCompany && portfolio) {
      const newExchangeRate = await getExchangeRate(
        `${selectedCompany?.baseCurrency.code}/${
          portfolio?.baseCurrency.code
        }/${form.getFieldValue("transactionDate")}/`,
      );
      if (exchangeRateResponse.ok) {
        console.log(newExchangeRate);
        form.setFieldsValue({
          exchangeRate: newExchangeRate.exchangeRate,
        });
        exchangeRateCache.clear();
      } else {
        form.setFields([
          {
            name: "exchangeRate",
            errors: ["Unable to fetch the exchange rates for the given date"],
          },
        ]);
      }
    }
  };
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        commission: initialCommission,
        grossPricePerShare: initialGrossPricePerShare,
        count: initialCount,
        transactionDate: initialTransactionDate.format("YYYY-MM-DD"),
        company: selectedCompany ? selectedCompany.id : undefined,
      }}
    >
      <Row>
        <Col>
          <Typography.Title level={4}>
            {initialCompanyTicker} ({initialCompanyCurrency})
          </Typography.Title>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="count"
            label="Count"
            rules={[{ required: true, message: "Please input the company" }]}
            help={`Received: ${inputData[7]}`}
          >
            <Input placeholder="Count" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="grossPricePerShare"
            label="Gross price per share"
            rules={[{ required: true, message: "Please input the price" }]}
            help={`Received: ${inputData[8]}`}
          >
            <Input placeholder="Price" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="commission"
            label="Commission"
            rules={[{ required: true, message: "Please input the commission" }]}
            help={`Received: ${inputData[11]}`}
          >
            <Input placeholder="Commission" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="company"
            label="Company"
            rules={[{ required: true, message: "Please select a company" }]}
          >
            <Select placeholder="Company" onChange={onCompanyChange}>
              {portfolio.companies.map((element) => (
                <Select.Option key={element.id} value={element.id}>
                  {element.name} ({element.ticker})
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
            help={`Received: ${inputData[6]}`}
          >
            <Input placeholder="Date" />
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
                  disabled={initialTransactionDate === null || !selectedCompany}
                  onClick={fetchExchangeRate}
                  loading={exchangeRateLoading}
                  title={`${selectedCompany?.dividendsCurrency.code} to ${portfolio.baseCurrency.code}`}
                >
                  {t("Get exchange rate")}
                </Button>
              </Form.Item>
            </Col>
          </>
        )}
        <Col span={12}>
          <Form.Item label="&nbsp;">
            <Button
              type="primary"
              htmlType="submit"
              disabled={formSent}
              loading={sharesLoading}
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
