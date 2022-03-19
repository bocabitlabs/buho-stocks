import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Col, Form, Input, Modal, Row, Select, TimePicker } from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import ColorSelector from "components/ColorSelector/ColorSelector";
import CountrySelector from "components/CountrySelector/CountrySelector";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import {
  useAddMarket,
  useMarket,
  useTimezones,
  useUpdateMarket,
} from "hooks/use-markets/use-markets";

interface AddEditFormProps {
  title: string;
  okText: string;
  marketId?: number;
  isModalVisible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
}

function MarketAddEditForm({
  title,
  okText,
  marketId,
  isModalVisible,
  onCreate,
  onCancel,
}: AddEditFormProps): ReactElement | null {
  const [form] = Form.useForm();
  const [color, setColor] = useState("#607d8b");
  const [region, setRegion] = useState("");
  const { t } = useTranslation();
  const { data: timezones, isLoading: timezonesLoading } = useTimezones();
  const { mutate: createMarket } = useAddMarket();
  const { mutate: updatedMarket } = useUpdateMarket();
  const {
    data: market,
    error: errorFetchingMarket,
    isFetching: fetchingMarket,
  } = useMarket(marketId, {
    onSuccess: (data: any) => {
      setColor(data.color);
      setRegion(data.region);
    },
  });

  useEffect(() => {
    if (color && region) {
      setColor(color);
      setRegion(region);
    }
  }, [color, region]);

  const handleSubmit = async (values: any) => {
    const { name, description, openTime, closeTime, timezone } = values;
    const newMarket = {
      name,
      description,
      region,
      color,
      openTime: openTime.format("HH:mm"),
      closeTime: closeTime.format("HH:mm"),
      timezone,
    };
    if (marketId) {
      updatedMarket({ marketId, newMarket });
    } else {
      createMarket(newMarket);
    }
  };

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
  };

  const handleCountryChange = (code: string) => {
    console.debug(code);
    setRegion(code);
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

  useEffect(() => {
    if (market) {
      form.setFieldsValue({
        name: market?.name,
        description: market?.description,
        region: market?.region,
        openTime: market ? moment(market?.openTime, "HH:mm") : "",
        closeTime: market ? moment(market?.closeTime, "HH:mm") : "",
        timezone: market?.timezone,
      });
    }
  }, [form, market]);

  if (fetchingMarket) {
    return <LoadingSpin />;
  }

  if (errorFetchingMarket) {
    return (
      <Alert
        showIcon
        message="Unable to load market"
        description={errorFetchingMarket.message}
        type="error"
      />
    );
  }

  return (
    <Modal
      visible={isModalVisible}
      title={title}
      okText={okText}
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleFormSubmit}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: market?.name,
          description: market?.description,
          region: market?.region,
          openTime: market ? moment(market?.openTime, "HH:mm") : "",
          closeTime: market ? moment(market?.closeTime, "HH:mm") : "",
          timezone: market?.timezone,
        }}
      >
        {" "}
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="name"
              label={t("Name")}
              rules={[
                {
                  required: true,
                  // message: t("Please input the name of the market"),
                },
              ]}
            >
              <Input type="text" placeholder="NYSE, NASDAQ,..." />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="description"
              label={t("Description")}
              rules={[{ required: false }]}
            >
              <Input type="text" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="region"
              label={t("Country")}
              rules={[{ required: true }]}
            >
              <CountrySelector
                handleChange={handleCountryChange}
                initialValue={region}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
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
              <ColorSelector
                color={color}
                handleColorChange={handleColorChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="openTime"
              label={t("Opening time")}
              rules={[
                { required: true, message: t("Please input the opening time") },
              ]}
            >
              <TimePicker name="openTime" format="HH:mm" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="closeTime"
              label={t("Closing time")}
              rules={[
                { required: true, message: t("Please input the closing time") },
              ]}
            >
              <TimePicker name="closeTime" format="HH:mm" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="timezone"
              label={t("Timezone")}
              rules={[{ required: true }]}
            >
              <Select
                showSearch
                loading={timezonesLoading}
                style={{ width: 200 }}
                placeholder="Search to Select"
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {timezones?.map((timezone: any, index: number) => (
                  <Select.Option value={timezone.name} key={index.toString()}>
                    {timezone.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

MarketAddEditForm.defaultProps = {
  marketId: undefined,
};

export default MarketAddEditForm;
