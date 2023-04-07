import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Button, Form, Input } from "antd";
import { useAddBenchmarkYear } from "hooks/use-benchmarks/use-benchmark-years";
import { IBenchmarkYearFormFields } from "types/benchmark";

interface AddFormProps {
  benchmarkId: number;
}

function BenchmarkYearAddForm({
  benchmarkId,
}: AddFormProps): ReactElement | null {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const { mutate: createBenchmarkYear } = useAddBenchmarkYear();

  const handleSubmit = async (values: any) => {
    const { year, value, valueCurrency, returnPercentage } = values;
    const newBenchmark: IBenchmarkYearFormFields = {
      year,
      value,
      valueCurrency,
      returnPercentage,
      benchmark: benchmarkId,
    };

    createBenchmarkYear(newBenchmark);
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      await handleSubmit(values);
      form.resetFields();
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };

  return (
    <div>
      <Form form={form} onFinish={handleFormSubmit}>
        <Form.Item
          name="year"
          label={t("Year")}
          rules={[
            {
              required: true,
              message: t("Please input the year of the benchmark"),
            },
          ]}
        >
          <Input type="text" />
        </Form.Item>
        <Form.Item
          name="value"
          label={t("Value")}
          rules={[
            {
              required: true,
              message: t("Please input the value of the benchmark"),
            },
          ]}
        >
          <Input type="text" />
        </Form.Item>
        <Form.Item
          name="valueCurrency"
          label={t("Currency code")}
          help="EUR, USD, etc."
          rules={[
            {
              required: true,
              message: t("Please input the currency code of the benchmark"),
            },
          ]}
        >
          <Input type="text" />
        </Form.Item>
        <Form.Item
          name="returnPercentage"
          label={t("Return")}
          rules={[
            {
              required: true,
              message: t("Please input the return of the benchmark"),
            },
          ]}
        >
          <Input type="text" suffix="%" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default BenchmarkYearAddForm;
