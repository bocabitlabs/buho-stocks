import React, { ReactElement } from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "antd";
import CompanyAddPageHeader from "./components/CompaniesAddPageHeader/CompaniesAddPageHeader";
import CompanyAddEditForm from "components/CompanyAddEditForm/CompanyAddEditForm";

export default function CompaniesAddPage(): ReactElement {
  const { id } = useParams();
  const portfolioId: string = id!;

  return (
    <CompanyAddPageHeader portfolioId={portfolioId}>
      <Row>
        <Col>
          <CompanyAddEditForm portfolioId={portfolioId} />
        </Col>
        <Col />
      </Row>
    </CompanyAddPageHeader>
  );
}
