import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { login } from "../_redux/authCrud";
import auth_service from "./../../../services/auth";

function Login(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "GENERAL.FORM.ERROR.REQUIRED",
        })
      ),
    password: Yup.string()
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
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      enableLoading();
      setTimeout(async () => {

        const { data, status, msj } = await login(values.username, values.password);
        disableLoading();
        if (status === 200) {
          await auth_service.login({ user: data.data });
          return props.login(data.data.access_token);
        }

        setSubmitting(false);
        setStatus(
          `${intl.formatMessage({
            id: "AUTH.VALIDATION.INVALID_LOGIN",
          })} ${msj}`
        );
      }, 1000);
    },
  });

  return (
    <div className="login-form login-signin" id="kt_login_signin_form">
      {/* begin::Head */}
      <div className="text-center mb-10 mb-lg-20">
        <h3 className="font-size-h1">
          <FormattedMessage id="AUTH.LOGIN.TITLE" />
        </h3>
        <p className="text-muted font-weight-bold">
          <FormattedMessage id="AUTH.LOGIN.SUBTITLE" />
        </p>
      </div>
      {/* end::Head */}

      {/*begin::Form*/}
      <form
        onSubmit={formik.handleSubmit}
        className="form fv-plugins-bootstrap fv-plugins-framework"
      >
        {formik.status ? (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        ) : ('')}

        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Username"
            type="text"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "username"
            )}`}
            name="username"
            {...formik.getFieldProps("username")}
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.username}</div>
            </div>
          ) : null}
        </div>
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Password"
            type="password"
            className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
              "password"
            )}`}
            name="password"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.password}</div>
            </div>
          ) : null}
        </div>
        <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
          <button
            id="kt_login_signin_submit"
            type="submit"
            disabled={formik.isSubmitting}
            className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
          >
            <span><FormattedMessage id="AUTH.GENERAL.SUBMIT" /></span>
            {loading && <span className="ml-3 spinner spinner-white"></span>}
          </button>
          <Link
            to="/auth/forgot-password"
            className="text-dark-50 text-hover-primary my-3 mr-2"
            id="kt_login_forgot"
          >
            <FormattedMessage id="AUTH.GENERAL.FORGOT_BUTTON" />
          </Link>
        </div>
      </form>
      {/*end::Form*/}
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(Login));
