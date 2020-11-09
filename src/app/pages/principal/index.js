import React from "react";
import Calendar from "./Calendar";
import { useHistory } from 'react-router-dom';

/**
 * Services
 */
import auth from "./../../services/auth";
import routes_api from "./../../services/http/requests/routes-api";

export const PPrincipal = () => {
    const history = useHistory();
    const permisision = auth.getPermission('Dashboard', null, false);
    if (!permisision) history.push(routes_api.frontend_tip_top().components.auth.home);
    return (<Calendar></Calendar>);
};

export { PProfile } from "./PProfile";