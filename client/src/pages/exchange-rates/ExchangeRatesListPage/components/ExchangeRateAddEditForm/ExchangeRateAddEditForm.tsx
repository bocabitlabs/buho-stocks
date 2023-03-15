import React, { ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Form, Input, Modal } from "antd";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import {
  useAddCurrency,
  useCurrency,
  useUpdateCurrency,
} from "hooks/use-currencies/use-currencies";
import { ICurrencyFormFields } from "types/currency";

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

  const { mutate: createCurrency } = useAddCurrency();
  const { mutate: updateCurrency } = useUpdateCurrency();
  const {
    data: currency,
    error: errorFetching,
    isFetching,
    isSuccess,
  } = useCurrency(id);

  const handleSubmit = async (values: any) => {
    const { name, code, symbol } = values;
    const newCurrency: ICurrencyFormFields = {
      name,
      code,
      symbol,
    };

    if (id) {
      updateCurrency({
        id: +id,
        newCurrency,
      });
    } else {
      createCurrency(newCurrency);
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

  useEffect(() => {
    if (currency) {
      form.setFieldsValue({
        name: currency.name,
        code: currency.code,
        symbol: currency.symbol,
      });
    }
  }, [form, currency]);

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
            name="name"
            label={t("Name")}
            rules={[
              {
                required: true,
                message: t("Please input the name of the currency"),
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item name="code" label={t("Code")}>
            <Input type="text" />
          </Form.Item>
          <Form.Item name="symbol" label={t("Symbol")}>
            <Input type="text" />
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
