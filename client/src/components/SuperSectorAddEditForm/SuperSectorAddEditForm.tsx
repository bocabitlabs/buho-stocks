import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Form, Input } from "antd";
import ColorSelector from "components/ColorSelector/ColorSelector";
import {
  useAddSuperSector,
  useUpdateSuperSector,
} from "hooks/use-sectors/use-super-sectors";
import { ISector } from "types/sector";

interface AddEditFormProps {
  sector?: ISector;
}

function SuperSectorAddEditForm({ sector }: AddEditFormProps) {
  const [form] = Form.useForm();
  const [color, setColor] = useState("#607d8b");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutateAsync: createSuperSectorAsync } = useAddSuperSector();
  const { mutateAsync: updateSuperSectorAsync } = useUpdateSuperSector();

  useEffect(() => {
    if (sector) {
      setColor(sector.color);
      //     // form.setFieldsValue({
      //     //   name: sector.name,
      //     //   isSuperSector: sector.isSuperSector,
      //     //   superSectorId: sector.superSector?.id,
      //     // });
      //   }

      //   // if (isSuper) {
      //   //   result = await getSuperSectors(`${sectorId}/`);
      //   //   if (superSectorsResponse.ok) {
      //   //     setColor(result.color);
      //   //     form.setFieldsValue({
      //   //       name: result.name,
      //   //     });
      //   //   }
    }
  }, [sector]);

  const handleSuperSectorSubmit = async (newSector: any) => {
    let actionType = "update";
    try {
      if (sector) {
        updateSuperSectorAsync({ sectorId: sector.id, newSector });
      } else {
        createSuperSectorAsync(newSector);
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
    await handleSuperSectorSubmit(newSector);
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
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {sector ? t(`Update super sector`) : t("Add super sector")}
        </Button>
      </Form.Item>
    </Form>
  );
}
SuperSectorAddEditForm.defaultProps = {
  sector: null,
};

export default SuperSectorAddEditForm;
