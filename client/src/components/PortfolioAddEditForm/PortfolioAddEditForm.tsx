import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Form, Input, Select, Switch } from "antd";
import ColorSelector from "components/ColorSelector/ColorSelector";
import CountrySelector from "components/CountrySelector/CountrySelector";
import { useCurrencies } from "hooks/use-currencies/use-currencies";
import {
  useAddPortfolio,
  useUpdatePortfolio,
} from "hooks/use-portfolios/use-portfolios";
import { ICurrency } from "types/currency";
import { IPortfolio } from "types/portfolio";

interface AddEditFormProps {
  portfolio?: IPortfolio;
}

function PortfolioAddEditForm({
  portfolio,
}: AddEditFormProps): ReactElement | null {
  const [form] = Form.useForm();
  const [color, setColor] = useState("#607d8b");
  const [countryCode, setCountryCode] = useState("");
  const { t } = useTranslation();
  const { mutateAsync: createPortfolio } = useAddPortfolio();
  const { mutateAsync: updatePortfolio } = useUpdatePortfolio();

  const { data: currencies, isFetching: currenciesLoading } = useCurrencies();
  const navigate = useNavigate();

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

    if (portfolio) {
      try {
        await updatePortfolio({ portfolioId: portfolio.id, newPortfolio });
        toast.success(t("Portfolio has been updated"));
        navigate(-1);
      } catch (error) {
        toast.error(t("Cannot update portfolio"));
      }
    } else {
      try {
        await createPortfolio(newPortfolio);
        toast.success(t("Portfolio has been created"));
        navigate(-1);
      } catch (error) {
        toast.error(t("Cannot create portfolio"));
      }
    }
  };

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
  };

  const handleCountryChange = (newValue: string) => {
    setCountryCode(newValue);
  };

  return (
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
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {portfolio ? t("Update portfolio") : t("Add portfolio")}
        </Button>
      </Form.Item>
    </Form>
  );
}

PortfolioAddEditForm.defaultProps = {
  portfolio: null,
};

export default PortfolioAddEditForm;
