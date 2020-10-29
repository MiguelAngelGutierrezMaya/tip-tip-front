/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,no-undef */
import React, { useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { toAbsoluteUrl } from "../../../../_helpers";
import { FormattedMessage } from "react-intl";

/**
 * Components
 */
import {
  Snackbar,
  TablePagination,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

/**
 * Services
 */
import routes_api from "./../../../../../app/services/http/requests/routes-api";
import { backoffice_service } from './../../../../../app/services/http/requests/index';
import auth from './../../../../../app/services/auth';
import roles from "./../../../../../app/utils/roles";

export function QuickUser() {
  const history = useHistory();

  const { user } = useSelector(state => state.auth);

  const logoutClick = () => {
    const toggle = document.getElementById("kt_quick_user_toggle");
    if (toggle) {
      toggle.click();
    }
    history.push("/logout");
  };

  /**
   * States
   */
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [snackbar, setSnackbar] = useState({
    status: false,
    code: "",
    message: ""
  });

  /**
     * Constructors
     */
  useEffect(() => {
    async function fetchData() {
      return await handleChangePage(null, 0);
    }
    fetchData();
  }, []);

  /**
   * Handlers
   */
  const handleChangePage = async (event, page) => {
    const token = auth.getToken();
    const response = await backoffice_service().getNotifications({ token, page }, { admin_notifications: true });
    if (response.error) return setSnackbar({ status: true, code: "error", message: response.msj });
    setTotal(response.data.data.count);
    setPage(page);
    setNotifications([...response.data.data.results]);
  };

  const handleCloseSnackbar = () =>
    setSnackbar({
      status: false,
      snackbar: "",
      message: ""
    });

  return (
    <>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackbar.status} autoHideDuration={10000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.code}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <div id="kt_quick_user" className="offcanvas offcanvas-right offcanvas p-10">
        <div className="offcanvas-header d-flex align-items-center justify-content-between pb-5">
          <h3 className="font-weight-bold m-0">
            <FormattedMessage id="DASHBOARD.HEADER.SIDEBAR.PROFILE.TITLE" />
          </h3>
          <a
            href="#"
            className="btn btn-xs btn-icon btn-light btn-hover-primary"
            id="kt_quick_user_close"
          >
            <i className="ki ki-close icon-xs text-muted" />
          </a>
        </div>

        <div
          className="offcanvas-content pr-5 mr-n5"
        >
          <div className="d-flex align-items-center mt-5">
            <div
              className="symbol symbol-100 mr-5"
            >
              <div className="symbol-label" style={{
                backgroundImage: `url(${toAbsoluteUrl(`${user.pic}`)})`
              }} />
              <i className="symbol-badge bg-success" />
            </div>
            <div className="d-flex flex-column">
              <a
                href="#"
                className="font-weight-bold font-size-h5 text-dark-75 text-hover-primary mb-3"
              >
                {user.username}
              </a>
              <button className="btn btn-light-primary btn-bold" onClick={logoutClick}>
                <FormattedMessage id="DASHBOARD.HEADER.SIDEBAR.PROFILE.SESSION" />
              </button>
            </div>
          </div>

          <div className="navi mt-2">
            <a href="#" className="navi-item">
              <span className="navi-link p-0 pb-2">
                <span className="navi-icon mr-1">
                  <span className="svg-icon-lg svg-icon-primary">
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/Communication/Mail-notification.svg"
                      )}
                    ></SVG>
                  </span>
                </span>
                <span className="navi-text text-muted text-hover-primary">
                  {user.email}
                </span>
              </span>
            </a>
          </div>

          <div className="separator separator-dashed mt-2 mb-2" />

          <div className="navi navi-spacer-x-0 p-0">
            <a href={routes_api.frontend_tip_top().components.auth.profile} className="navi-item">
              <div className="navi-link">
                <div className="symbol symbol-40 bg-light mr-3">
                  <div className="symbol-label">
                    <span className="svg-icon svg-icon-md svg-icon-success">
                      <SVG
                        src={toAbsoluteUrl(
                          "/media/svg/icons/General/Notification2.svg"
                        )}
                      ></SVG>
                    </span>
                  </div>
                </div>
                <div className="navi-text">
                  <div className="font-weight-bold">
                    <FormattedMessage id="DASHBOARD.HEADER.SIDEBAR.PROFILE.ACCOUNT_INFO.TITLE" />
                  </div>
                  <div className="text-muted">
                    <FormattedMessage id="DASHBOARD.HEADER.SIDEBAR.PROFILE.ACCOUNT_INFO.TEXT" />
                  </div>
                </div>
              </div>
            </a>
          </div>

          <div className="separator separator-dashed my-7"></div>

          <div>
            <h5 className="mb-5">
              <FormattedMessage id="DASHBOARD.HEADER.SIDEBAR.PROFILE.NOTIFICATIONS.TITLE" />
            </h5>

            {
              notifications.length > 0 && roles[auth.getUserInfo().user.role.name] === roles.ROLE_ADMIN ?
                (
                  <>
                    {
                      notifications.map((el, index) => {
                        switch (el.data.type) {
                          case 'missing_student':
                            return (
                              <div key={`quick-user-notification-${index}`} className="d-flex align-items-center bg-light-danger rounded p-5 gutter-b">
                                <span className="svg-icon svg-icon-danger mr-5">
                                  <SVG
                                    src={toAbsoluteUrl("/media/svg/icons/Code/Warning-2.svg")}
                                    className="svg-icon svg-icon-lg"
                                  ></SVG>
                                </span>

                                <div className="d-flex flex-column flex-grow-1 mr-2">
                                  <a
                                    href="#"
                                    className="font-weight-normal text-dark-75 text-hover-primary font-size-lg mb-1"
                                  >
                                    <h5>{el.title}</h5>
                                    <span>Estudiante: {el.data.student}</span><br />
                                    <span>Lección: {el.data.lesson}</span><br />
                                    <span>Fecha: {el.data.date} {el.data.time}</span>
                                  </a>
                                </div>
                              </div>
                            )
                            break;
                          default:
                            return (<></>)
                        }
                      })
                    }
                    <TablePagination
                      component="div"
                      count={total}
                      page={page}
                      onChangePage={handleChangePage}
                      rowsPerPage={Number(process.env.REACT_APP_PAGE_SIZE) - 2}
                      rowsPerPageOptions={[Number(process.env.REACT_APP_PAGE_SIZE) - 2]}
                    />
                  </>
                )
                : (
                  <div className="d-flex align-items-center bg-light-warning rounded p-5 gutter-b">
                    <span className="svg-icon svg-icon-warning mr-5">
                      <SVG
                        src={toAbsoluteUrl("/media/svg/icons/Home/Library.svg")}
                        className="svg-icon svg-icon-lg"
                      ></SVG>
                    </span>

                    <div className="d-flex flex-column flex-grow-1 mr-2">
                      <a
                        href="#"
                        className="font-weight-normal text-dark-75 text-hover-primary font-size-lg mb-1"
                      >
                        <FormattedMessage id="DASHBOARD.HEADER.SIDEBAR.PROFILE.NOTIFICATIONS.EMPTY_TEXT" />
                      </a>
                    </div>
                  </div>
                )
            }
          </div>
        </div>
      </div>
    </>
  );
}
