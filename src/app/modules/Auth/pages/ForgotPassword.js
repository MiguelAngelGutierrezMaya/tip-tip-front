import React, { useState } from "react";
import { useFormik } from "formik";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import * as Yup from "yup";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { forgotPassword } from "../_redux/authCrud";

import {
  Snackbar
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const initialValues = {
  email: "",
};

function ForgotPassword(props) {
  const { intl } = props;
  const [snackbar, setSnackbar] = useState({
    status: false,
    code: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "GENERAL.FORM.ERROR.REQUIRED",
        })
      ),
  });

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
  };

  const handleCloseSnackbar = () =>
    setSnackbar({
      status: false,
      snackbar: "",
      message: ""
    });

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formik = useFormik({
    initialValues,
    validationSchema: ForgotPasswordSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      enableLoading();
      setIsRequested(false);
      setTimeout(async () => {

        const { data, status, msj } = await forgotPassword(values.email);
        disableLoading();
        if (status === 200) {
          setSnackbar({ status: true, code: "success", message: (<FormattedMessage id="FORGOT_PASSWORD.GENERAL.SUCCESS"></FormattedMessage>) })
          setTimeout(() => setIsRequested(true), 3000);
        } else {
          setIsRequested(false);
          setSubmitting(false);
          setSnackbar({ status: true, code: "error", message: msj })
        }
      }, 1000);
    },
  });

  return (
    <>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackbar.status} autoHideDuration={10000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.code}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      {isRequested && <Redirect to="/auth" />}
      {!isRequested && (
        <div className="login-form login-forgot" style={{ display: "block" }}>
          <div className="text-center mb-10 mb-lg-20">
            <h3 className="font-size-h1">Forgotten Password ?</h3>
            <div className="text-muted font-weight-bold">
              Enter your email to reset your password
            </div>
          </div>
          <form
            onSubmit={formik.handleSubmit}
            className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp"
          >
            {formik.status && (
              <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
                <div className="alert-text font-weight-bold">
                  {formik.status}
                </div>
              </div>
            )}
            <div className="form-group fv-plugins-icon-container">
              <input
                type="email"
                className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                  "email"
                )}`}
                name="email"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.email}</div>
                </div>
              ) : null}
            </div>
            <div className="form-group d-flex flex-wrap flex-center">
              <button
                id="kt_login_forgot_submit"
                type="submit"
                className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
                disabled={formik.isSubmitting}
              >
                <span><FormattedMessage id="FORGOT_PASSWORD.GENERAL.SUBMIT" /></span>
                {loading && <span className="ml-3 spinner spinner-white"></span>}
              </button>
              <Link to="/auth">
                <button
                  type="button"
                  id="kt_login_forgot_cancel"
                  className="btn btn-light-primary font-weight-bold px-9 py-4 my-3 mx-4"
                >
                  <FormattedMessage id="GENERAL.FORM.ACTIONS.CANCEL" />
                </button>
              </Link>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default injectIntl(connect(null, auth.actions)(ForgotPassword));
