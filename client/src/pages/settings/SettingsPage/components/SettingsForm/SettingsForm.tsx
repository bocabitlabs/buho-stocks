import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Button, Form, Select } from "antd";
import { useTimezones } from "hooks/use-markets/use-markets";
import {
  useSettings,
  useUpdateSettings,
} from "hooks/use-settings/use-settings";
import { ISettingsFormFields } from "types/settings";

function SettingsForm(): ReactElement | null {
  const [form] = Form.useForm();
  const { isFetching, data, error } = useSettings();
  const { mutateAsync: updateSettingsAsync } = useUpdateSettings();
  const { t, i18n } = useTranslation();
  const { data: timezones, isLoading: timezonesLoading } = useTimezones();

  const handleUpdate = async (values: any) => {
    const {
      // companyDisplayMode,
      // companySortBy,
      language,
      timezone,
      // mainPortfolio,
      // portfolioDisplayMode,
      // portfolioSortBy
    } = values;
    const newSettings: ISettingsFormFields = {
      language,
      timezone,
      companyDisplayMode: "TODO",
      companySortBy: "TODO",
      mainPortfolio: "TODO",
      portfolioDisplayMode: "TODO",
      portfolioSortBy: "TODO",
    };
    if (data) {
      updateSettingsAsync({ id: data.id, newSettings });
      i18n.changeLanguage(newSettings.language);
    }
  };

  if (isFetching) {
    return <div>{t("Fetching settings...")}</div>;
  }

  if (error) {
    return <div>{t("Unable to fetch settings.")}</div>;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleUpdate}
      initialValues={{
        // companyDisplayMode: settings.companyDisplayMode,
        // companySortBy: settings.companySortBy,
        language: data?.language,
        timezone: data?.timezone,
        // mainPortfolio: settings.mainPortfolio,
        // portfolioDisplayMode: settings.portfolioDisplayMode,
        // portfolioSortBy: settings.portfolioSortBy
      }}
    >
      <Form.Item name="language" label={t("Language")}>
        <Select placeholder={t("Select a language")}>
          <Select.Option value="en" key="en">
            English
          </Select.Option>
          <Select.Option value="es" key="es">
            Español
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="timezone"
        label={t("Account Timezone")}
        rules={[{ required: true }]}
      >
        <Select
          showSearch
          loading={timezonesLoading}
          style={{ width: 200 }}
          placeholder={t("Search to Select")}
          optionFilterProp="children"
          filterOption={(input: any, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {timezones?.map((timezone: any) => (
            <Select.Option value={timezone.name} key={timezone.name}>
              {timezone.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {t("Update settings")}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default SettingsForm;
