/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import { FormattedMessage } from "react-intl";

/**
 * Services
 */
import MenuList from "./MenuList";
import auth from "./../../../../../app/services/auth";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };

  return (
    <>
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {
          MenuList.map((el, i) => {
            const { user } = auth.getUserInfo();
            const admin = el.verify.admin ?
              user.role.name === 'ROLE_ADMIN' ?
                true : false :
              true;

            if (admin) {
              if (el.url != null) {
                return (
                  <li
                    className={`menu-item ${getMenuItemActive(`${el.url}`, false)}`}
                    aria-haspopup="true"
                    key={`menu-${i}`}
                  >
                    <NavLink className="menu-link" to={el.url}>
                      <span className="svg-icon menu-icon">
                        {
                          el.icons.svg.included ? (
                            <SVG src={toAbsoluteUrl(`/media/svg/icons/${el.icons.svg.icon}`)} />
                          ) : el.icons.flaticon.included ? (
                            <i className={el.icons.flaticon.icon}></i>
                          ) : (<></>)
                        }
                      </span>
                      <span className="menu-text text-white">
                        <FormattedMessage id={el.i18n} />
                      </span>
                    </NavLink>
                  </li>
                )
              } else {
                return (
                  <li
                    className={`menu-item menu-item-submenu ${getMenuItemActive(`/${el.slug}`, true)}`}
                    aria-haspopup="true"
                    data-menu-toggle="hover"
                    key={`menu-${i}`}
                  >
                    <NavLink className="menu-link menu-toggle" to={`/${el.slug}`}>
                      <span className="svg-icon menu-icon">
                        {
                          el.icons.svg.included ? (
                            <SVG src={toAbsoluteUrl(`/media/svg/icons/${el.icons.svg.icon}`)} />
                          ) : el.icons.flaticon.included ? (
                            <i className={el.icons.flaticon.icon}></i>
                          ) : (<></>)
                        }
                      </span>
                      <span className="menu-text text-white">
                        <FormattedMessage id={el.i18n} />
                      </span>
                      <i className="menu-arrow" />
                    </NavLink>
                    <div className="menu-submenu ">
                      <ul className="menu-subnav">
                        <ul className="menu-subnav">
                          <li
                            className="menu-item  menu-item-parent"
                            aria-haspopup="true"
                          >
                            <span className="menu-link">
                              <span className="menu-text text-white">
                                <FormattedMessage id={el.i18n} />
                              </span>
                            </span>
                          </li>
                          {
                            el.submenu.map((el, j) => {
                              if (admin && el.show)
                                return (
                                  <li
                                    className={`menu-item ${getMenuItemActive(`${el.slug}`)}`}
                                    aria-haspopup="true"
                                    key={`menu-${i}-submenu-${j}`}
                                  >
                                    <NavLink className="menu-link" to={el.url}>
                                      <i className="menu-bullet menu-bullet-dot">
                                        <span />
                                      </i>
                                      <span className="menu-text text-white">
                                        <FormattedMessage id={el.i18n} />
                                      </span>
                                    </NavLink>
                                  </li>
                                )
                            })
                          }
                        </ul>
                      </ul>
                    </div>
                  </li>
                )
              }
            }
          })
        }
      </ul>
    </>
  );
}
