import WrapperPage from "pages/WrapperPage/WrapperPage";
import React from "react";
import { Link } from "react-router-dom";

// Params are placeholders in the URL that begin
// with a colon, like the `:id` param defined in
// the route in this example. A similar convention
// is used for matching dynami§wc segments in other
// popular web frameworks like Rails and Express.

export default function Markets() {
  return (
    <WrapperPage>
      <h2>Accounts</h2>

      <ul>
        <li>
          <Link to="/app/markets/1">Netflix</Link>
        </li>
        <li>
          <Link to="/app/markets/2">Zillow Group</Link>
        </li>
        <li>
          <Link to="/app/markets/3">Yahoo</Link>
        </li>
        <li>
          <Link to="/app/markets/modus-create">Modus Create</Link>
        </li>
      </ul>
    </WrapperPage>
  );
}
