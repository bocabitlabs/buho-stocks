import React, { ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Form, Input, Modal } from "antd";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import {
  useAddBenchmark,
  useBenchmark,
  useUpdateBenchmark,
} from "hooks/use-benchmarks/use-benchmarks";
import { IBenchmarkFormFields } from "types/benchmark";

interface AddEditFormProps {
  id?: number;
  title: string;
  okText: string;
  isModalVisible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
}

function BenchmarkAddEditForm({
  title,
  okText,
  isModalVisible,
  onCreate,
  onCancel,
  id,
}: AddEditFormProps): ReactElement | null {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const { mutate: updateBenchmark } = useUpdateBenchmark();
  const { mutate: createBenchmark } = useAddBenchmark();
  const {
    data: benchmark,
    error: errorFetching,
    isFetching,
    isSuccess,
  } = useBenchmark(id);

  const handleSubmit = async (values: any) => {
    const { name } = values;
    const newBenchmark: IBenchmarkFormFields = {
      name,
    };

    if (id) {
      updateBenchmark({
        id: +id,
        newBenchmark,
      });
    } else {
      createBenchmark(newBenchmark);
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
    if (benchmark) {
      form.setFieldsValue({
        name: benchmark.name,
      });
    }
  }, [form, benchmark]);

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
          message={t("Unable to load benchmark")}
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
                message: t("Please input the name of the benchmark"),
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

BenchmarkAddEditForm.defaultProps = {
  id: undefined,
};

export default BenchmarkAddEditForm;
