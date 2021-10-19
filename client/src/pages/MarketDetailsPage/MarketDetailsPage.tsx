import WrapperPage from "pages/WrapperPage/WrapperPage";
import React from "react";
import { Link, useParams } from "react-router-dom";


function MarketDetailsPage() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { id } = useParams<{ id: string }>();

  return (
    <WrapperPage>
      <h3>ID: {id}</h3>
      <Link to={`/app/markets/${id}/edit`}>Edit</Link>
    </WrapperPage>
  );
}
export default MarketDetailsPage;
