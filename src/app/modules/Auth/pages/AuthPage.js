import React from "react";
import { Link, Switch, Redirect } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import { ContentRoute } from "../../../../_metronic/layout"
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import "../../../../_metronic/_assets/sass/pages/login/classic/login-1.scss";

import routes_api from "./../../../services/http/requests/routes-api"

export function AuthPage() {
  return (
    <>
      <div className="d-flex flex-column flex-root">
        {/*begin::Login*/}
        <div
          className="login login-1 login-signin-on d-flex flex-column flex-lg-row flex-row-fluid bg-white"
          id="kt_login"
        >
          {/*begin::Aside*/}
          <div
            className="login-aside d-flex flex-row-auto bgi-size-cover bgi-no-repeat p-10 p-lg-10"
            style={{
              'backgroundImage': `url(${toAbsoluteUrl("/media/bg/bg-login.png")})`,
              'backgroundPosition': 'center',
              'backgroundRepeat': 'no-repeat',
              'backgroundSize': 'cover'
            }}
          >
            {/*begin: Aside Container*/}
            <div className="d-flex flex-row-fluid flex-column justify-content-between">
              {/* start:: Aside header */}
              <Link to="/" className="flex-column-auto mt-5">
                <img
                  alt="Logo"
                  className="max-h-70px"
                  src={toAbsoluteUrl("/media/icon-tiptop.png")}
                />
              </Link>
              {/* end:: Aside header */}

              {/* start:: Aside content */}
              <div className="flex-column-fluid d-flex flex-column justify-content-end">
                <img
                  alt="Logo"
                  src={toAbsoluteUrl("/media/message-login-tip-top.png")}
                />
              </div>
              {/* end:: Aside content */}
            </div>
            {/*end: Aside Container*/}
          </div>
          {/*begin::Aside*/}

          {/*begin::Content*/}
          <div className="flex-row-fluid d-flex flex-column position-relative p-7 overflow-hidden">
            {/* begin::Content body */}
            <div className="d-flex flex-column-fluid flex-center mt-30 mt-lg-0">
              <Switch>
                <ContentRoute path={routes_api.frontend_tip_top().components.guest.login} component={Login} />
                {/* <ContentRoute path="/auth/registration" component={Registration} /> */}
                <ContentRoute
                  path={routes_api.frontend_tip_top().components.guest.forgot}
                  component={ForgotPassword}
                />
                <Redirect from="/auth" exact={true} to={routes_api.frontend_tip_top().components.guest.login} />
                <Redirect to={routes_api.frontend_tip_top().components.guest.login} />
              </Switch>
            </div>
            {/*end::Content body*/}
          </div>
          {/*end::Content*/}
        </div>
        {/*end::Login*/}
      </div>
    </>
  );
}
