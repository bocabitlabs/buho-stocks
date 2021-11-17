import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Form, Input, Select, Spin, Switch } from "antd";
import ColorSelector from "components/ColorSelector/ColorSelector";
import { useCurrenciesContext } from "hooks/use-currencies/use-currencies-context";
import { usePortfoliosContext } from "hooks/use-portfolios/use-portfolios-context";
import { ISector } from "types/sector";

interface AddEditFormProps {
  portfolioId?: string;
}

function PortfolioAddEditForm({
  portfolioId
}: AddEditFormProps): ReactElement | null {
  const [form] = Form.useForm();
  const [color, setColor] = useState("#607d8b");
  // const [superSectorId, setSuperSectorId] = useState<number | undefined>(
  //   undefined
  // );
  const { t } = useTranslation();

  const {
    portfolio,
    create: addPortfolio,
    getById: getPortfolioById,
    update: updatePortfolio
  } = usePortfoliosContext();

  const { currencies, getAll: getAllCurrencies } = useCurrenciesContext();

  useEffect(() => {
    if (portfolioId) {
      const id: number = +portfolioId;
      getPortfolioById(id);
    }
  }, [portfolioId, getPortfolioById]);

  useEffect(() => {
    const getAll = async () => {
      getAllCurrencies();
    };
    getAll();
  }, [getAllCurrencies]);

  useEffect(() => {
    if (portfolioId) {
      if (portfolio) {
        setColor(portfolio.color);
        // setSuperSectorId(sector.superSector);
      }
    }
  }, [portfolioId, portfolio]);

  const handleSubmit = (values: any) => {
    const { name, description, baseCurrencyId, hideClosedCompanies } = values;
    const newPortfolio = {
      name,
      color,
      description,
      baseCurrency: baseCurrencyId,
      hideClosedCompanies
    };
    console.log(newPortfolio);

    if (portfolioId) {
      const id: number = +portfolioId;
      updatePortfolio(id, newPortfolio);
    } else {
      addPortfolio(newPortfolio);
    }
  };

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
  };

  // const handleSuperSectorChange = (id: number) => {
  //   setSuperSectorId(id);
  // };

  if (portfolioId && !portfolio) {
    return <Spin />;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        name: portfolio?.name,
        description: portfolio?.description,
        hideClosedCompanies: portfolio?.hideClosedCompanies,
        baseCurrencyId: portfolio?.baseCurrency
      }}
    >
      <Form.Item
        name="name"
        label={t("Name")}
        rules={[
          { required: true, message: t("Please input the name of the market") }
        ]}
      >
        <Input type="text" placeholder="NYSE, NASDAQ,..." />
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
        <Select placeholder={t("Select a base currency")} allowClear>
          {currencies &&
            currencies.map((sectorItem: ISector) => (
              <Select.Option
                value={sectorItem.id}
                key={`currency-${sectorItem.id}-${sectorItem.id}`}
              >
                {sectorItem.name}
              </Select.Option>
            ))}
        </Select>
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
          {portfolioId ? t("Update portfolio") : t("Add portfolio")}
        </Button>
      </Form.Item>
    </Form>
  );
}

PortfolioAddEditForm.defaultProps = {
  portfolioId: null
};

export default PortfolioAddEditForm;
