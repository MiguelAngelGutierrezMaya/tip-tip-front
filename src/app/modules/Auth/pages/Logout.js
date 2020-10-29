import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { LayoutSplashScreen } from "../../../../_metronic/layout";
import * as auth from "../_redux/authRedux";
import routes_api from "./../../../services/http/requests/routes-api"

class Logout extends Component {
  componentDidMount() {
    this.props.logout();
  }

  render() {
    const { hasAuthToken } = this.props;
    return hasAuthToken ? <LayoutSplashScreen /> : <Redirect to={routes_api.frontend_tip_top().components.guest.login} />;
  }
}

export default connect(
  ({ auth }) => ({ hasAuthToken: Boolean(auth.authToken) }),
  auth.actions
)(Logout);
