import React, { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-layout";
import { Button, Popconfirm, Typography, theme } from "antd";
import breadCrumbRender from "breadcrumbs";
import CountryFlag from "components/CountryFlag/CountryFlag";
import { useDeleteCompany } from "hooks/use-companies/use-companies";
import CompanyAddEditForm from "pages/companies/CompanyDetailsPage/components/CompanyAddEditForm/CompanyAddEditForm";

interface Props {
  companyName: string;
  companyCountryCode: string;
  portfolioName: string;
  children: ReactNode;
}
const { useToken } = theme;

function CompanyDetailsPageHeader({
  companyName,
  portfolioName,
  companyCountryCode,
  children,
}: Props) {
  const { t } = useTranslation();
  const { id, companyId } = useParams();
  const portfolioId = id ? parseInt(id, 10) : undefined;
  const companyIdNumber = companyId ? parseInt(companyId, 10) : undefined;
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

  const onCloseCallback = () => {
    setIsModalVisible(false);
  };

  return (
    <PageHeader
      className="site-page-header"
      style={{ background: token.colorBgContainer }}
      tags={[
        <CountryFlag
          code={companyCountryCode}
          key={companyCountryCode}
          width={20}
        />,
      ]}
      title={<Typography.Title level={2}>{companyName}</Typography.Title>}
      breadcrumb={{ items: routes }}
      breadcrumbRender={breadCrumbRender}
      extra={[
        <Button
          key="company-edit-header"
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
          <Button icon={<DeleteOutlined />} danger />
        </Popconfirm>,
      ]}
    >
      {children}
      <CompanyAddEditForm
        portfolioId={portfolioId}
        companyId={companyIdNumber}
        isVisible={isModalVisible}
        isUpdate
        onCloseCallback={onCloseCallback}
      />
    </PageHeader>
  );
}

export default CompanyDetailsPageHeader;
