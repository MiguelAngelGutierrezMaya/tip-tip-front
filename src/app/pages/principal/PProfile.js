import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

/**
 * Components
 */
import { FCEHeader } from '../../components'
import { Autocomplete } from '@material-ui/lab';
import {
  Grid,
  TextField,
  Button,
  FormControl,
  FormLabel,
  Snackbar
} from '@material-ui/core';

import Alert from '@material-ui/lab/Alert';
import { FormattedMessage } from "react-intl";

/**
 * Services
 */
import { backoffice_service, auth_service } from './../../services/http/requests/index';
import routes_api from "./../../services/http/requests/routes-api";
import auth from './../../services/auth';
import validator from './../../services/validation';

export const PProfile = () => {

  const history = useHistory();
  const permisision = auth.getPermission('Dashboard', 'Perfil');
  if (!permisision) history.push(routes_api.frontend_tip_top().components.auth.home);

  /**
   * States
   */
  const [documents, setDocuments] = useState([]);
  const [cities, setCities] = useState([]);
  const [snackbar, setSnackbar] = useState({
    status: false,
    code: "",
    message: ""
  });

  /**
   * States form
   */
  const formInitData = {
    city: {
      error: false,
      msj: "",
      data: null,
      type: ['required']
    },
    documentType: {
      error: false,
      msj: "",
      data: null,
      type: ['required']
    },
    document: {
      error: false,
      msj: "",
      data: "",
      type: ['required', 'min:8', 'max:15']
    },
    firstName: {
      error: false,
      msj: "",
      data: "",
      type: ['required', 'min:3']
    },
    lastName: {
      error: false,
      msj: "",
      data: "",
      type: ['required', 'min:3']
    },
    phoneNumber: {
      error: false,
      msj: "",
      data: "",
      type: ['required', 'min:8', 'max:15', 'number']
    },
    address: {
      error: false,
      msj: "",
      data: "",
      type: ['required']
    }
  }
  const formInitDataPassword = {
    password: {
      error: false,
      msj: "",
      data: "",
      type: ['required', 'min:8', 'max:30']
    },
    new_password: {
      error: false,
      msj: "",
      data: "",
      type: ['required', 'min:8', 'max:30', 'strong_password']
    },
    confirmPassword: {
      error: false,
      msj: "",
      data: "",
      type: ['required', 'min:8', 'max:30', 'confirmed:new_password']
    }
  }

  const [formData, setFormData] = useState({ ...formInitData });
  const [formDataPassword, setFormDataPassword] = useState({ ...formInitDataPassword });

  /**
   * Constructors
   */
  async function loadData() {
    const token = auth.getToken();
    const response_cities = await backoffice_service().getCities({ token });
    const response_documents = await backoffice_service().getDocuments({ token });
    const response_user = await auth_service().getUserByToken(token);
    if (response_cities.error) setSnackbar({ status: true, code: "error", message: response_cities.msj });
    if (response_documents.error) setSnackbar({ status: true, code: "error", message: response_documents.msj });
    if (response_user.error) setSnackbar({ status: true, code: "error", message: response_user.msj });
    const obj = { ...formData };
    obj.city.data = response_user.data.data.city;
    obj.documentType.data = response_user.data.data.document;
    obj.document.data = response_user.data.data.document_number;
    obj.firstName.data = response_user.data.data.first_name;
    obj.lastName.data = response_user.data.data.last_name;
    obj.phoneNumber.data = response_user.data.data.phone_number;
    obj.address.data = response_user.data.data.address;
    setFormData({ ...obj });
    setCities([...response_cities.data.data]);
    setDocuments([...response_documents.data.data]);
  }

  useEffect(() => {
    async function fetchData() {
      return await loadData();
    }
    fetchData();
  }, []);

  /**
   * Handlers
   */

  const handleCloseSnackbar = () =>
    setSnackbar({
      status: false,
      snackbar: "",
      message: ""
    });

  const handleChangeFormData = (property, value) => {
    const form_data_obj = formData;
    form_data_obj[property].data = value;
    setFormData({ ...form_data_obj });
  }

  const handleChangeFormDataPassword = (property, value) => {
    const form_data_obj = formDataPassword;
    form_data_obj[property].data = value;
    setFormDataPassword({ ...form_data_obj });
  }

  const handleChangeCity = (event, value) => handleChangeFormData('city', value);
  const handleChangeDocument = (event, value) => handleChangeFormData('documentType', value);
  const handleChangeDocumentText = (event) => handleChangeFormData('document', event.target.value);
  const handleChangeFirstName = (event) => handleChangeFormData('firstName', event.target.value);
  const handleChangeLastName = (event) => handleChangeFormData('lastName', event.target.value);
  const handleChangePhoneNumber = (event) => handleChangeFormData('phoneNumber', event.target.value);
  const handleChangeAddress = (event) => handleChangeFormData('address', event.target.value);

  const handleChangePassword = (event) => handleChangeFormDataPassword('password', event.target.value);
  const handleChangeNewPassword = (event) => handleChangeFormDataPassword('new_password', event.target.value);
  const handleChangeConfirmPassword = (event) => handleChangeFormDataPassword('confirmPassword', event.target.value);

  const responseEditUser = (response, msj, time) => {
    if (response.error) return setSnackbar({ status: true, code: "error", message: response.msj });
    setSnackbar({ status: true, code: "success", message: msj })
    setTimeout(() => {
      const toggle = document.getElementById("kt_quick_user_toggle");
      if (toggle) toggle.click()
      history.push(routes_api.frontend_tip_top().components.general.logout);
    }, time);
  }

  const handleSaveUserData = async (event) => {
    event.preventDefault();
    let error = false;
    setFormData({ ...validator(formData) });
    Object.entries(formData).forEach(([key, value]) => { if (value.error) error = true; });
    if (error) return setSnackbar({ status: true, code: "error", message: (<FormattedMessage id="GENERAL.FORM.ERROR.ERRORS.TEXT"></FormattedMessage>) });
    const token = auth.getToken();
    const response = await backoffice_service().editUser({
      data: {
        first_name: formData.firstName.data,
        last_name: formData.lastName.data,
        phone_number: formData.phoneNumber.data,
        address: formData.address.data,
        document_number: formData.document.data,
        city_id: formData.city.data.id,
        document_id: formData.documentType.data.id
      }, token
    });
    return responseEditUser(response, <FormattedMessage id="DASHBOARD.CONTENT.PROFILE.EDIT.MESSAGES.SUCCESS"></FormattedMessage>, 5000);
  }

  const handleSaveNewPassword = async (event) => {
    event.preventDefault();
    let error = false;
    setFormDataPassword({ ...validator(formDataPassword) });
    Object.entries(formDataPassword).forEach(([key, value]) => { if (value.error) error = true; });
    if (error) return setSnackbar({ status: true, code: "error", message: (<FormattedMessage id="GENERAL.FORM.ERROR.ERRORS.TEXT"></FormattedMessage>) });
    const token = auth.getToken();
    const response = await backoffice_service().changePassword({
      data: {
        modify_password: true,
        password: formDataPassword.password.data,
        new_password: formDataPassword.new_password.data,
        password_confirmation: formDataPassword.confirmPassword.data,
      }, token
    });
    return responseEditUser(response, <FormattedMessage id="DASHBOARD.CONTENT.PROFILE.EDIT.MESSAGES.SUCCESS_PASSWORD"></FormattedMessage>, 5000);
  }

  return (
    <>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackbar.status} autoHideDuration={10000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.code}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4} md={4} lg={4}>
          <div className={`card card-custom card-stretch gutter-b`}>
            {/* Header */}
            <FCEHeader title={<FormattedMessage id="DASHBOARD.CONTENT.PROFILE.TABLE.PASSWORD.TITLE"></FormattedMessage>} subtitle={<FormattedMessage id="DASHBOARD.CONTENT.PROFILE.TABLE.PASSWORD.SUBTITLE"></FormattedMessage>}></FCEHeader>
            {/* Body */}
            <div className="card-body d-flex flex-column pt-0">
              <Grid container>
                <form noValidate autoComplete="off" onSubmit={handleSaveNewPassword}>
                  <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                    <FormControl component="fieldset" className="wd-full">
                      <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.PROFILE.TABLE.FORM.CURRENT_PASSWORD"></FormattedMessage></FormLabel>
                      <TextField type="password" label="*****" variant="outlined" size="small" className="form-text-field mt-2" onChange={handleChangePassword} value={formDataPassword.password.data} error={formDataPassword.password.error} helperText={formDataPassword.password.msj} />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                    <FormControl component="fieldset" className="wd-full">
                      <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.PROFILE.TABLE.FORM.NEW_PASSWORD"></FormattedMessage></FormLabel>
                      <TextField type="password" label="*****" variant="outlined" size="small" className="form-text-field mt-2" onChange={handleChangeNewPassword} value={formDataPassword.new_password.data} error={formDataPassword.new_password.error} helperText={formDataPassword.new_password.msj} />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                    <FormControl component="fieldset" className="wd-full">
                      <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.PROFILE.TABLE.FORM.CONFIRM_NEW_PASSWORD"></FormattedMessage></FormLabel>
                      <TextField type="password" label="*****" variant="outlined" size="small" className="form-text-field mt-2" onChange={handleChangeConfirmPassword} value={formDataPassword.confirmPassword.data} error={formDataPassword.confirmPassword.error} helperText={formDataPassword.confirmPassword.msj} />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                    <Button type="submit" variant="contained" className="btn-primary btn-block h-35">
                      <FormattedMessage id="GENERAL.FORM.ACTIONS.SAVE"></FormattedMessage>
                    </Button>
                  </Grid>
                </form>
              </Grid>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={8} md={8} lg={8}>
          <div className={`card card-custom card-stretch gutter-b`}>
            {/* Header */}
            <FCEHeader title={<FormattedMessage id="DASHBOARD.CONTENT.PROFILE.TABLE.PASSWORD.TITLE"></FormattedMessage>} subtitle={<FormattedMessage id="DASHBOARD.CONTENT.PROFILE.TABLE.PROFILE_DATA.SUBTITLE"></FormattedMessage>}></FCEHeader>
            {/* Body */}
            <div className="card-body d-flex flex-column">
              <form noValidate autoComplete="off" onSubmit={handleSaveUserData}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={6} lg={6} className="mt-2">
                    <FormControl component="fieldset" className="wd-full">
                      <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.PROFILE.TABLE.FORM.DOCUMENT_TYPE.LABEL"></FormattedMessage></FormLabel>
                      <Autocomplete
                        options={documents}
                        getOptionLabel={(option) => option.name ? option.name : ""}
                        value={formData.documentType.data}
                        size={'small'}
                        style={{ width: "100%" }}
                        onChange={handleChangeDocument}
                        renderInput={(params) => <TextField {...params} label={<FormattedMessage id="GENERAL.FORM.SELECT_OPTION"></FormattedMessage>} variant="outlined" style={{ height: "40px" }} error={formData.documentType.error} helperText={formData.documentType.msj} />}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6} >
                    <FormControl component="fieldset" className="wd-full">
                      <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.PROFILE.TABLE.FORM.DOCUMENT.LABEL"></FormattedMessage></FormLabel>
                      <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.PROFILE.TABLE.FORM.DOCUMENT.TEXT"></FormattedMessage>} value={formData.document.data} variant="outlined" size="small" className="form-text-field mt-2" onChange={handleChangeDocumentText} error={formData.document.error} helperText={formData.document.msj} />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6} className="mt-2">
                    <FormControl component="fieldset" className="wd-full">
                      <FormLabel component="legend">
                        <FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.CITY"></FormattedMessage>
                      </FormLabel>
                      <Autocomplete
                        options={cities}
                        getOptionLabel={(option) => option.name ? option.name : ""}
                        value={formData.city.data}
                        size={'small'}
                        style={{ width: "100%" }}
                        onChange={handleChangeCity}
                        renderInput={(params) => <TextField {...params} label="Seleccione una opción" variant="outlined" style={{ height: "40px" }} error={formData.city.error} helperText={formData.city.msj} />}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <FormControl component="fieldset" className="wd-full">
                      <FormLabel component="legend">
                        <FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.NAMES"></FormattedMessage>
                      </FormLabel>
                      <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.NAMES.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2" onChange={handleChangeFirstName} value={formData.firstName.data} error={formData.firstName.error} helperText={formData.firstName.msj} />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <FormControl component="fieldset" className="wd-full">
                      <FormLabel component="legend">
                        <FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.LAST_NAMES"></FormattedMessage>
                      </FormLabel>
                      <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.LAST_NAMES.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2" onChange={handleChangeLastName} value={formData.lastName.data} error={formData.lastName.error} helperText={formData.lastName.msj} />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <FormControl component="fieldset" className="wd-full">
                      <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.PHONE_NUMBER"></FormattedMessage></FormLabel>
                      <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.PHONE_NUMBER.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2" onChange={handleChangePhoneNumber} value={formData.phoneNumber.data} error={formData.phoneNumber.error} helperText={formData.phoneNumber.msj} />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <FormControl component="fieldset" className="wd-full">
                      <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.ADDRESS"></FormattedMessage></FormLabel>
                      <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.ADDRESS.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2" onChange={handleChangeAddress} value={formData.address.data} error={formData.address.error} helperText={formData.address.msj} />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Grid container spacing={3} className="justify-content-end">
                      <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Button type="submit" variant="contained" className="btn-primary btn-block h-35">
                          <FormattedMessage id="GENERAL.FORM.ACTIONS.SAVE"></FormattedMessage>
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
};
