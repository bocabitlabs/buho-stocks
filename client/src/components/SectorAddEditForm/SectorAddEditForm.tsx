import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Form, Input, Select, Switch } from "antd";
import ColorSelector from "components/ColorSelector/ColorSelector";
import { useAddSector, useUpdateSector } from "hooks/use-sectors/use-sectors";
import { useSuperSectors } from "hooks/use-sectors/use-super-sectors";
import { ISector } from "types/sector";

interface AddEditFormProps {
  sector?: ISector;
  isSuper?: boolean;
}

function SectorAddEditForm({ sector, isSuper }: AddEditFormProps) {
  const [form] = Form.useForm();
  const [color, setColor] = useState("#607d8b");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: superSectors } = useSuperSectors();

  const { mutateAsync: createSectorAsync } = useAddSector();
  const { mutateAsync: updateSectorAsync } = useUpdateSector();

  const handleSectorSubmit = async (newSector: any) => {
    let actionType = "update";
    try {
      if (sector) {
        updateSectorAsync({ sectorId: sector.id, newSector });
      } else {
        createSectorAsync(newSector);
        actionType = "create";
      }
      toast.success(`Sector has been ${actionType}d`);
      navigate(-1);
    } catch (error) {
      toast.error(`Cannot ${actionType} sector`);
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
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        name: sector?.name,
        isSuperSector: sector?.isSuperSector,
        superSectorId: sector?.superSector?.id,
      }}
    >
      <Form.Item
        name="name"
        label={t("Name")}
        rules={[
          { required: true, message: t("Please input the name of the sector") },
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
        <ColorSelector color={color} handleColorChange={handleColorChange} />
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
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {sector
            ? t(`Update ${sector.isSuperSector ? "super" : ""} sector`)
            : t("Add sector")}
        </Button>
      </Form.Item>
    </Form>
  );
}
SectorAddEditForm.defaultProps = {
  sector: null,
  isSuper: false,
};

export default SectorAddEditForm;
