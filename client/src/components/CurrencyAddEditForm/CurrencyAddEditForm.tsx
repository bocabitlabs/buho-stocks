import React, { ReactElement, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Form, Input, Spin } from "antd";
import ColorSelector from "components/ColorSelector/ColorSelector";
import CountrySelector from "components/CountrySelector/CountrySelector";
import { CurrenciesContext } from "contexts/currencies";

interface AddEditFormProps {
  currencyId?: string;
}

function CurrencyAddEditForm({
  currencyId
}: AddEditFormProps): ReactElement | null {
  const [form] = Form.useForm();
  const [color, setColor] = useState("#607d8b");
  const [country, setCountry] = useState("");
  const { t } = useTranslation();

  const {
    currency,
    create: addCurrency,
    getById: getMarketById,
    update: updateCurrency
  } = useContext(CurrenciesContext);

  useEffect(() => {
    if (currencyId) {
      const id: number = +currencyId;
      getMarketById(id);
    }
  }, [currencyId, getMarketById]);

  useEffect(() => {
    if (currencyId) {
      if (currency) {
        setColor(currency.color);
        setCountry(currency.country);
      }
    }
  }, [currencyId, currency]);

  const handleSubmit = (values: any) => {
    const { name, abbreviation, symbol } = values;
    const newElement = {
      name,
      color,
      abbreviation,
      country,
      symbol
    };
    console.log(newElement);
    if (currencyId) {
      const id: number = +currencyId;
      updateCurrency(id, newElement);
    } else {
      addCurrency(newElement);
    }
  };

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
  };

  const handleCountryChange = (newValue: string) => {
    console.debug(newValue);
    setCountry(newValue);
  };

  if (currencyId && !currency) {
    return <Spin />;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        name: currency?.name,
        abbreviation: currency?.abbreviation,
        country: currency?.country,
        symbol: currency?.symbol
      }}
    >
      <Form.Item
        name="name"
        label={t("Name")}
        rules={[
          {
            required: true,
            message: t("Please input the name of the currency")
          }
        ]}
      >
        <Input type="text" />
      </Form.Item>
      <Form.Item
        name="symbol"
        label={t("Symbol")}
        rules={[
          { required: true, message: t("Please input the name of the symbol") }
        ]}
      >
        <Input type="text" />
      </Form.Item>
      <Form.Item
        name="abbreviation"
        label={t("Abbreviation")}
        rules={[
          {
            required: true,
            message: t("Please input the name of the abbreviation")
          }
        ]}
      >
        <Input type="text" />
      </Form.Item>
      <Form.Item name="country" label={t("Country")}>
        <CountrySelector
          handleChange={handleCountryChange}
          initialValue={currency?.country}
        />
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
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {currencyId ? t("Update currency") : t("Add currency")}
        </Button>
      </Form.Item>
    </Form>
  );
}

CurrencyAddEditForm.defaultProps = {
  currencyId: null
};

export default CurrencyAddEditForm;
