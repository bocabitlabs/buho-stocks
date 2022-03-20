import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Form, Input, Modal, Select, Switch } from "antd";
import ColorSelector from "components/ColorSelector/ColorSelector";
import CountrySelector from "components/CountrySelector/CountrySelector";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import { useCurrencies } from "hooks/use-currencies/use-currencies";
import {
  useAddPortfolio,
  usePortfolio,
  useUpdatePortfolio,
} from "hooks/use-portfolios/use-portfolios";
import { ICurrency } from "types/currency";

interface AddEditFormProps {
  title: string;
  okText: string;
  portfolioId?: number;
  isModalVisible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
}

function PortfolioAddEditForm({
  title,
  okText,
  isModalVisible,
  onCreate,
  onCancel,
  portfolioId,
}: AddEditFormProps): ReactElement | null {
  const [form] = Form.useForm();
  const [color, setColor] = useState("#607d8b");
  const [countryCode, setCountryCode] = useState("");
  const { t } = useTranslation();
  const { mutate: createPortfolio } = useAddPortfolio();
  const { mutate: updatePortfolio } = useUpdatePortfolio();
  const { data: currencies, isFetching: currenciesLoading } = useCurrencies();
  const {
    data: portfolio,
    error: errorFetchingPortfolio,
    isFetching: isErrorFetching,
  } = usePortfolio(portfolioId);

  useEffect(() => {
    if (portfolio) {
      setColor(portfolio.color);
      setCountryCode(portfolio.countryCode);
    }
  }, [portfolio]);

  const handleSubmit = async (values: any) => {
    const { name, description, baseCurrencyId, hideClosedCompanies } = values;
    const newPortfolio = {
      name,
      color,
      description,
      baseCurrency: baseCurrencyId,
      hideClosedCompanies: !!hideClosedCompanies,
      countryCode,
    };

    if (portfolioId) {
      updatePortfolio({ portfolioId, newPortfolio });
    } else {
      createPortfolio(newPortfolio);
    }
  };

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
  };

  const handleCountryChange = (newValue: string) => {
    setCountryCode(newValue);
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      await handleSubmit(values);
      form.resetFields();
      onCreate(values);
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };

  if (isErrorFetching) {
    return <LoadingSpin />;
  }

  if (errorFetchingPortfolio) {
    return (
      <Alert
        showIcon
        message={t("Unable to load portfolio")}
        description={errorFetchingPortfolio.message}
        type="error"
      />
    );
  }

  return (
    <Modal
      visible={isModalVisible}
      title={title}
      okText={okText}
      cancelText={t("Cancel")}
      onCancel={onCancel}
      onOk={handleFormSubmit}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: portfolio?.name,
          description: portfolio?.description,
          hideClosedCompanies: portfolio?.hideClosedCompanies,
          baseCurrencyId: portfolio?.baseCurrency,
          countryCode: portfolio?.countryCode,
        }}
      >
        <Form.Item
          name="name"
          label={t("Name")}
          rules={[
            {
              required: true,
              message: t("Please input the name of the portfolio"),
            },
          ]}
        >
          <Input type="text" />
        </Form.Item>
        <Form.Item
          label={
            <div>
              {t("Color")}:{" "}
              <svg
                width="35"
                height="35"
                viewBox="0 0 35 35"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="10"
                  y="10"
                  width="25"
                  height="25"
                  rx="5"
                  ry="5"
                  fill={color}
                />
              </svg>
            </div>
          }
        >
          <ColorSelector color={color} handleColorChange={handleColorChange} />
        </Form.Item>
        <Form.Item name="baseCurrencyId" label={t("Base currency")}>
          <Select
            showSearch
            placeholder={t("Select a base currency")}
            allowClear
            loading={currenciesLoading}
          >
            {currencies &&
              currencies.map((item: ICurrency) => (
                <Select.Option
                  value={item.code}
                  key={`currency-${item.code}-${item.code}`}
                >
                  {item.name} ({item.code})
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="countryCode" label={t("Country")}>
          <CountrySelector
            handleChange={handleCountryChange}
            initialValue={countryCode}
          />
        </Form.Item>
        <Form.Item
          label={t("Hide closed companies")}
          name="hideClosedCompanies"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item name="description" label={t("Description")}>
          <Input type="text" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

PortfolioAddEditForm.defaultProps = {
  portfolioId: undefined,
};

export default PortfolioAddEditForm;
