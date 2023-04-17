import React, { ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Col, Form, Input, Modal, Row, Select, TimePicker } from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
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
  id?: number;
  isModalVisible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
}

function MarketAddEditForm({
  title,
  okText,
  id,
  isModalVisible,
  onCreate,
  onCancel,
}: AddEditFormProps): ReactElement | null {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { data: timezones, isLoading: timezonesLoading } = useTimezones();
  const { mutate: createMarket } = useAddMarket();
  const { mutate: updatedMarket } = useUpdateMarket();
  const {
    data: market,
    error: errorFetchingMarket,
    isFetching: fetchingMarket,
  } = useMarket(id);

  const handleSubmit = async (values: any) => {
    const { name, description, openTime, closeTime, timezone, region } = values;
    const newMarket = {
      name,
      description,
      region,
      color: "#607d8b",
      openTime: openTime.format("HH:mm"),
      closeTime: closeTime.format("HH:mm"),
      timezone,
    };
    if (id) {
      updatedMarket({ id, newMarket });
    } else {
      createMarket(newMarket);
    }
  };

  const handleCountryChange = (code: string) => {
    console.log(code);
    form.setFieldValue("region", code);
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
        message={t("Unable to load market")}
        description={errorFetchingMarket.message}
        type="error"
      />
    );
  }

  return (
    <Modal
      open={isModalVisible}
      title={title}
      okText={okText}
      cancelText={t("Cancel")}
      onCancel={onCancel}
      afterClose={onCancel}
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
                initialValue={market ? market.region : ""}
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
                placeholder={t("Search to Select")}
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {timezones?.map((timezone: any) => (
                  <Select.Option value={timezone.name} key={timezone.name}>
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
  id: undefined,
};

export default MarketAddEditForm;
