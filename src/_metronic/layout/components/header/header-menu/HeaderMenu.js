/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { checkIsActive } from "../../../../_helpers";
import moment from 'moment-timezone';

/**
 * Services
 */
import { FormattedMessage } from "react-intl";

export function HeaderMenu({ layoutProps }) {
    const location = useLocation();
    const getMenuItemActive = (url) => {
        return checkIsActive(location, url) ? "menu-item-active" : "";
    }

    return <div
        id="kt_header_menu"
        className={`header-menu header-menu-mobile ${layoutProps.ktMenuClasses}`}
        {...layoutProps.headerMenuAttributes}
    >
        {/*begin::Header Nav*/}
        <ul className={`menu-nav ${layoutProps.ulClasses}`}>
            <li className={`menu-item menu-item-rel ${getMenuItemActive('/dashboard')}`}>
                {
                    moment().format('YYYY-MM-DD h:mm A')
                } - <FormattedMessage id="GENERAL.FORM.LOCAL_TIME"></FormattedMessage>
                <br />
                {
                    moment().tz("America/Bogota").format('YYYY-MM-DD h:mm A')
                } - <FormattedMessage id="GENERAL.FORM.LOCAL_TIME_COLOMBIA"></FormattedMessage>
            </li>
            <li
                data-menu-toggle={layoutProps.menuDesktopToggle}
                aria-haspopup="true"
                className={`menu-item menu-item-submenu menu-item-rel ${getMenuItemActive('/google-material')}`}>
            </li>
            <li
                className={`menu-item menu-item-submenu menu-item-rel ${getMenuItemActive('/react-bootstrap')}`}
                data-menu-toggle={layoutProps.menuDesktopToggle}
                aria-haspopup="true"
            >

            </li>
            <li
                data-menu-toggle={layoutProps.menuDesktopToggle}
                aria-haspopup="true"
                className={`menu-item menu-item-submenu menu-item-rel ${getMenuItemActive('/custom')}`}>

            </li>
            {/*end::1 Level*/}
        </ul>
        {/*end::Header Nav*/}
    </div>;
}
