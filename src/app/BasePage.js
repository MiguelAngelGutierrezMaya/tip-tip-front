import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";

/**
 * Components
 */
// import { BuilderPage } from "./pages/BuilderPage";
// import { DashboardPage } from "./pages/DashboardPage";


import { PProfile, PPrincipal } from "./pages/principal/index"
import { UsIndex } from "./pages/users/index";
import { LIndex } from "./pages/levels/index";
import { UIndex } from "./pages/units/index";
import { LeIndex } from "./pages/lessons/index";

/**
 * Services
 */
import routes_api from "./services/http/requests/routes-api";

// const GoogleMaterialPage = lazy(() =>
//   import("./modules/GoogleMaterialExamples/GoogleMaterialPage")
// );
// const ReactBootstrapPage = lazy(() =>
//   import("./modules/ReactBootstrapExamples/ReactBootstrapPage")
// );
// const ECommercePage = lazy(() =>
//   import("./modules/ECommerce/pages/eCommercePage")
// );

export default function BasePage() {
  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to={routes_api.frontend_tip_top().components.auth.home} />
        }

        {/* Principal */}
        <ContentRoute path={routes_api.frontend_tip_top().components.auth.home} component={PPrincipal} />
        <ContentRoute path={routes_api.frontend_tip_top().components.auth.profile} component={PProfile} />

        {/* Users */}
        <ContentRoute path={routes_api.frontend_tip_top().components.auth.users.index} component={UsIndex} />

        {/* Levels */}
        <ContentRoute path={routes_api.frontend_tip_top().components.auth.levels.index} component={LIndex} />

        {/* Units */}
        <ContentRoute path={routes_api.frontend_tip_top().components.auth.units.index} component={UIndex} />

        {/* Lessons */}
        <ContentRoute path={routes_api.frontend_tip_top().components.auth.lessons.index} component={LeIndex} />


        {/* Examples demos */}
        {/* <ContentRoute path={routes_api.frontend_tip_top().components.auth.home} component={DashboardPage} /> */}
        {/* <ContentRoute path="/builder" component={BuilderPage} />
        <Route path="/google-material" component={GoogleMaterialPage} />
        <Route path="/react-bootstrap" component={ReactBootstrapPage} />
        <Route path="/e-commerce" component={ECommercePage} /> */}

        {/* Errors */}
        <Redirect to={routes_api.frontend_tip_top().components.general.error} />
      </Switch>
    </Suspense>
  );
}
