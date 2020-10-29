/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";

/**}
 * Components
 */
import { Layout } from "../_metronic/layout";
import BasePage from "./BasePage";
import { Logout, AuthPage } from "./modules/Auth";
import ErrorsPage from "./modules/ErrorsExamples/ErrorsPage";

/**
 * Services
 */
import routes_api from "./services/http/requests/routes-api";

export function Routes() {
    const { isAuthorized } = useSelector(
        ({ auth }) => ({
            isAuthorized: auth.user != null,
        }),
        shallowEqual
    );

    return (
        <Switch>
            {!isAuthorized ? (
                /*Render auth page when user at `/auth` and not authorized.*/
                <Route>
                    <AuthPage />
                </Route>
            ) : (
                    /*Otherwise redirect to root page (`/`)*/
                    <Redirect from="/auth" to="/" />
                )}

            <Route path={routes_api.frontend_tip_top().components.general.error} component={ErrorsPage} />
            <Route path={routes_api.frontend_tip_top().components.general.logout} component={Logout} />


            {!isAuthorized ? (
                /*Redirect to `/auth` when user is not authorized*/
                <Redirect to={routes_api.frontend_tip_top().components.guest.login} />
            ) : (
                    <Layout>
                        <BasePage />
                    </Layout>
                )}
        </Switch>
    );
}
