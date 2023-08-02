import React, { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { DeleteOutlined, EditOutlined, LinkOutlined } from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-layout";
import { Button, Popconfirm, Tag, Typography, theme } from "antd";
import breadCrumbRender from "breadcrumbs";
import CountryFlag from "components/CountryFlag/CountryFlag";
import { useDeleteCompany } from "hooks/use-companies/use-companies";
import CompanyAddEditForm from "pages/companies/CompanyDetailsPage/components/CompanyAddEditForm/CompanyAddEditForm";

interface Props {
  companyName: string;
  companyTicker: string;
  companyLogo: string | undefined;
  companyCountryCode: string;
  portfolioName: string;
  companyUrl: string;
  children: ReactNode;
}
const { useToken } = theme;

function CompanyDetailsPageHeader({
  companyName,
  companyTicker,
  companyLogo,
  companyUrl,
  companyCountryCode,
  portfolioName,
  children,
}: Props) {
  const { t } = useTranslation();
  const { id, companyId } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { token } = useToken();
  const routes = [
    {
      href: `/portfolios/${id}`,
      title: portfolioName || t("Loading..."),
    },
    {
      href: `/portfolios/${id}/companies/${companyId}`,
      title: companyName || t("Loading..."),
    },
  ];
  const { mutate: deleteCompany } = useDeleteCompany();

  function confirmDelete() {
    deleteCompany({ portfolioId: +id!, companyId: +companyId! });
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onCreate = (values: any) => {
    console.log("Received values of form: ", values);
    setIsModalVisible(false);
  };

  const onCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <PageHeader
      className="site-page-header"
      style={{ background: token.colorBgContainer }}
      title={<Typography.Title level={2}>{companyName}</Typography.Title>}
      subTitle={companyTicker}
      avatar={{ src: companyLogo }}
      breadcrumb={{ items: routes }}
      breadcrumbRender={breadCrumbRender}
      tags={[
        <CountryFlag code={companyCountryCode} key={companyCountryCode} />,
        <Tag color="blue" key="url" style={{ marginLeft: 16 }}>
          <a href={companyUrl} target="_blank" rel="noopener noreferrer">
            <LinkOutlined />
          </a>
        </Tag>,
      ]}
      extra={[
        <Button
          key="company-edit-header"
          type="text"
          icon={<EditOutlined />}
          onClick={() => showModal()}
        />,
        <Popconfirm
          key="company-delete-header"
          title={t("Delete this company?")}
          onConfirm={() => confirmDelete()}
          okText={t("Yes")}
          cancelText={t("No")}
        >
          <Button icon={<DeleteOutlined />} type="text" danger />
        </Popconfirm>,
      ]}
    >
      {children}
      <CompanyAddEditForm
        title={t("Update company")}
        okText={t("Update")}
        portfolioId={+id!}
        companyId={+companyId!}
        isModalVisible={isModalVisible}
        onCreate={onCreate}
        onCancel={onCancel}
      />
    </PageHeader>
  );
}

export default CompanyDetailsPageHeader;
