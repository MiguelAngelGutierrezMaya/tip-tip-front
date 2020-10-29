/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";

/**
 * Services
 */
import routes_api from "./../../../../../app/services/http/requests/routes-api";

export function BreadCrumbs({ items }) {
  if (!items || !items.length) {
    return "";
  }

  return (
    <ul className="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2">
      <li className="breadcrumb-item">
        <Link to={routes_api.frontend_tip_top().components.auth.home}>
          <i className="flaticon2-shelter text-muted icon-1x" />
        </Link>
      </li>
      {items.map((item, index) => (
        <li key={`bc${index}`} className="breadcrumb-item">
          <Link className="text-muted" to={{ pathname: item.pathname }}>
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
