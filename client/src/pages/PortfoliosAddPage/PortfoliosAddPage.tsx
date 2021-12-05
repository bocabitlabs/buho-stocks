import React, { useContext } from "react";
import { Col, Row } from "antd";
import PortfoliosAddPageHeader from "./components/PortfoliosAddPageHeader/PortfoliosAddPageHeader";
import PortfolioAddEditForm from "components/PortfolioAddEditForm/PortfolioAddEditForm";
import { CurrenciesContext } from "contexts/currencies";
import { PortfoliosContext } from "contexts/portfolios";
import WrapperPage from "pages/WrapperPage/WrapperPage";

// Params are placeholders in the URL that begin
// with a colon, like the `:id` param defined in
// the route in this example. A similar convention
// is used for matching dynami§wc segments in other
// popular web frameworks like Rails and Express.

export default function PortfoliosAddPage() {
  const context = useContext(PortfoliosContext);
  const currenciesContext = useContext(CurrenciesContext);

  return (
    <CurrenciesContext.Provider value={currenciesContext}>
      <PortfoliosContext.Provider value={context}>
        <WrapperPage>
          <PortfoliosAddPageHeader>
            <Row>
              <Col>
                <PortfolioAddEditForm />
              </Col>
              <Col />
            </Row>
          </PortfoliosAddPageHeader>
        </WrapperPage>
      </PortfoliosContext.Provider>
    </CurrenciesContext.Provider>
  );
}
