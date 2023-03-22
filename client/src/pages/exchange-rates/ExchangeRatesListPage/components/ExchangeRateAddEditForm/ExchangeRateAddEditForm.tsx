import React, { ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert, DatePicker, Form, Input, Modal } from "antd";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import {
  useAddExchangeRate,
  useExchangeRateDetails,
  useUpdateExchangeRate,
} from "hooks/use-exchange-rates/use-exchange-rates";
import { IExchangeRateFormFields } from "types/exchange-rate";

interface AddEditFormProps {
  id?: number;
  title: string;
  okText: string;
  isModalVisible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
}

function ExchangeRateAddEditForm({
  title,
  okText,
  isModalVisible,
  onCreate,
  onCancel,
  id,
}: AddEditFormProps): ReactElement | null {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dateFormat = "YYYY-MM-DD";

  const { mutate: create } = useAddExchangeRate();
  const { mutate: update } = useUpdateExchangeRate();
  const {
    data: exchangeRateData,
    error: errorFetching,
    isFetching,
    isSuccess,
  } = useExchangeRateDetails(id);

  const handleSubmit = async (values: any) => {
    const { exchangeFrom, exchangeTo, exchangeRate, exchangeDate } = values;
    const newExchangeRate: IExchangeRateFormFields = {
      exchangeFrom,
      exchangeTo,
      exchangeRate,
      exchangeDate: exchangeDate.format(dateFormat),
    };

    if (id) {
      update({
        id: +id,
        newExchangeRate,
      });
    } else {
      create(newExchangeRate);
    }
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

  // const handleDateChange = (date: any, dateString: string) => {
  //   console.log(date, dateString);
  //   form.setFieldsValue({
  //     exchangeDate: dateString,
  //   });
  // };

  useEffect(() => {
    if (exchangeRateData) {
      form.setFieldsValue({
        exchangeFrom: exchangeRateData.exchangeFrom,
        exchangeTo: exchangeRateData.exchangeTo,
        exchangeRate: exchangeRateData.exchangeRate,
        exchangeDate: moment(exchangeRateData.exchangeDate),
      });
    }
  }, [form, exchangeRateData]);

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
      {isFetching && <LoadingSpin />}
      {errorFetching && (
        <Alert
          showIcon
          message={t("Unable to load currency")}
          description={errorFetching.message}
          type="error"
        />
      )}
      {(isSuccess || !id) && (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="exchangeFrom"
            label={t("From currency")}
            rules={[
              {
                required: true,
                message: t("Please input the origin currency"),
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            name="exchangeTo"
            label={t("To currency")}
            rules={[
              {
                required: true,
                message: t("Please input the destination currency"),
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            name="exchangeRate"
            label={t("Exchange rate")}
            rules={[
              {
                required: true,
                message: t("Please input the exchange rate"),
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            name="exchangeDate"
            label={t("Date")}
            rules={[
              {
                required: true,
                message: t("Please input the date"),
              },
            ]}
          >
            <DatePicker format={dateFormat} />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

ExchangeRateAddEditForm.defaultProps = {
  id: undefined,
};

export default ExchangeRateAddEditForm;
