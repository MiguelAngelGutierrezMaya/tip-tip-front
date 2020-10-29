import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { ErrorPage1 } from "./ErrorPage1";

/**
 * Services
 */
import routes_api from "./../../services/http/requests/routes-api";

export default function ErrorsPage() {
  return (
    <Switch>
      <Redirect from="/error" exact={true} to={routes_api.frontend_tip_top().components.general.page_not_found} />
      <Route path={routes_api.frontend_tip_top().components.general.page_not_found} component={ErrorPage1} />
    </Switch>
  );
}
