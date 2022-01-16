import React, { ReactElement, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, TimePicker } from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import ColorSelector from "components/ColorSelector/ColorSelector";
import CountrySelector from "components/CountrySelector/CountrySelector";
import { AlertMessagesContext } from "contexts/alert-messages";
import { useAddMarket, useUpdateMarket } from "hooks/use-markets/use-markets";
import { IMarket } from "types/market";

interface AddEditFormProps {
  market?: IMarket;
}

function MarketAddEditForm({ market }: AddEditFormProps): ReactElement | null {
  const [form] = Form.useForm();
  const [color, setColor] = useState(market ? market.color : "#607d8b");
  const [region, setRegion] = useState(market ? market.region : "");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createError, createSuccess } = useContext(AlertMessagesContext);
  const { mutateAsync: createMarketAsync } = useAddMarket();
  const { mutateAsync: updatedMarketAsync } = useUpdateMarket();

  useEffect(() => {
    if (color && region) {
      setColor(color);
      setRegion(region);
    }
  }, [color, region]);

  const handleSubmit = async (values: any) => {
    const { name, description, openTime, closeTime } = values;
    const newMarket = {
      name,
      description,
      region,
      color,
      openTime: openTime.format("HH:mm"),
      closeTime: closeTime.format("HH:mm"),
    };
    if (market) {
      try {
        await updatedMarketAsync({ marketId: market.id, newMarket });
        createSuccess(t("Market has been updated"));
        navigate(-1);
      } catch (error) {
        createError(t("Cannot update market"));
      }
    } else {
      try {
        await createMarketAsync(newMarket);
        createSuccess(t("Market created"));
        navigate(-1);
      } catch (error) {
        createError(t(`Cannot create market: ${error}`));
      }
    }
  };

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
  };

  const handleCountryChange = (code: string) => {
    console.debug(code);
    setRegion(code);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        name: market?.name,
        description: market?.description,
        region: market?.region,
        openTime: market ? moment(market?.openTime, "HH:mm") : "",
        closeTime: market ? moment(market?.closeTime, "HH:mm") : "",
      }}
    >
      <Form.Item
        name="name"
        label={t("Name")}
        rules={[
          { required: true, message: t("Please input the name of the market") },
        ]}
      >
        <Input type="text" placeholder="NYSE, NASDAQ,..." />
      </Form.Item>
      <Form.Item
        name="description"
        label={t("Description")}
        rules={[{ required: false }]}
      >
        <Input type="text" />
      </Form.Item>
      <Form.Item name="region" label={t("Country")}>
        <CountrySelector
          handleChange={handleCountryChange}
          initialValue={region}
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
      <Form.Item
        name="openTime"
        label={t("Opening time")}
        rules={[
          { required: true, message: t("Please input the opening time") },
        ]}
      >
        {/* <Input type="text" placeholder="HH:mm" /> */}
        <TimePicker name="openTime" format="HH:mm" />
      </Form.Item>
      <Form.Item
        name="closeTime"
        label={t("Closing time")}
        rules={[
          { required: true, message: t("Please input the closing time") },
        ]}
      >
        {/* <Input type="time" placeholder="HH:mm" /> */}
        <TimePicker name="closeTime" format="HH:mm" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {market ? t("Update market") : t("Add market")}
        </Button>
      </Form.Item>
    </Form>
  );
}

MarketAddEditForm.defaultProps = {
  market: null,
};

export default MarketAddEditForm;
