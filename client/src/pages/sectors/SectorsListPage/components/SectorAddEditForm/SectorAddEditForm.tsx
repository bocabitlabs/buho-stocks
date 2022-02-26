import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Form, Input, Modal, Select, Switch } from "antd";
import ColorSelector from "components/ColorSelector/ColorSelector";
import LoadingSpin from "components/LoadingSpin/LoadingSpin";
import {
  useAddSector,
  useSector,
  useUpdateSector,
} from "hooks/use-sectors/use-sectors";
import { useSuperSectors } from "hooks/use-sectors/use-super-sectors";
import { ISector } from "types/sector";

interface AddEditFormProps {
  title: string;
  okText: string;
  sectorId?: number;
  isModalVisible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
  isSuper?: boolean;
}

function SectorAddEditForm({
  title,
  okText,
  sectorId,
  isModalVisible,
  onCreate,
  onCancel,
  isSuper,
}: AddEditFormProps) {
  const [form] = Form.useForm();
  const [color, setColor] = useState("#607d8b");
  const { t } = useTranslation();

  const { data: superSectors } = useSuperSectors();
  const { mutate: createSector } = useAddSector();
  const { mutate: updateSector } = useUpdateSector();
  const {
    data: sector,
    error: errorFetching,
    isFetching,
    isSuccess,
  } = useSector(sectorId, {
    onSuccess: (data: any) => {
      setColor(data.color);
      form.setFieldsValue({ superSectorId: data.superSector });
    },
  });

  const handleSectorSubmit = async (newSector: any) => {
    if (sectorId) {
      updateSector({ sectorId, newSector });
    } else {
      createSector(newSector);
    }
  };

  const handleSubmit = async (values: any) => {
    const { name, isSuperSector, superSectorId } = values;
    const newSector = {
      name,
      color,
      superSector: superSectorId,
      isSuperSector,
    };

    await handleSectorSubmit(newSector);
  };

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
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
    if (sector) {
      form.setFieldsValue({
        name: sector?.name,
        isSuperSector: sector?.isSuperSector,
        superSectorId: sector?.superSector?.id,
      });
    }
  }, [form, sector]);

  return (
    <Modal
      visible={isModalVisible}
      title={title}
      okText={okText}
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleFormSubmit}
    >
      {isFetching && <LoadingSpin />}
      {errorFetching && (
        <Alert
          showIcon
          message="Unable to load sector"
          description={errorFetching.message}
          type="error"
        />
      )}
      {(isSuccess || !sectorId) && (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label={t("Name")}
            rules={[
              {
                required: true,
                message: t("Please input the name of the sector"),
              },
            ]}
          >
            <Input type="text" placeholder="REIT, Banks, Semiconductors,..." />
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
            <ColorSelector
              color={color}
              handleColorChange={handleColorChange}
            />
          </Form.Item>
          {!isSuper && (
            <Form.Item name="superSectorId" label={t("Super sector")}>
              <Select placeholder={t("Select its super sector")} allowClear>
                {superSectors &&
                  superSectors.map((sectorItem: ISector) => (
                    <Select.Option
                      value={sectorItem.id}
                      key={`sector-${sectorItem.id}-${sectorItem.id}`}
                    >
                      {sectorItem.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          )}
          {!isSuper && !sector && (
            <Form.Item
              label={t("Is a super sector")}
              name="isSuperSector"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          )}
        </Form>
      )}
    </Modal>
  );
}
SectorAddEditForm.defaultProps = {
  sectorId: undefined,
  isSuper: false,
};

export default SectorAddEditForm;
