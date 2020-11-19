import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import moment from "moment-timezone";

/**
 * Components
 */
import { Table, FCEHeader } from '../../components'
import { Autocomplete } from '@material-ui/lab';
import {
  Grid,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  ListItemText,
  Collapse,
  List,
  ListItem,
  Snackbar
} from '@material-ui/core';

import Alert from '@material-ui/lab/Alert';
import { FormattedMessage } from "react-intl";

/**
 * Icons
 */
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';

/**
 * Services
 */
import { backoffice_service } from './../../services/http/requests/index';
import routes_api from "./../../services/http/requests/routes-api";
import auth from './../../services/auth';
import validator from './../../services/validation'

/**
 * Utils
 */
import const_roles from './../../utils/roles';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  list_collapse: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  textField: {
    width: "100%",
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  table: {
    minWidth: 650,
  },
}));

export const UsIndex = () => {

  const classes = useStyles();
  const history = useHistory();
  const permisision = auth.getPermission('Usuarios', 'Principal', false);
  if (!permisision) history.push(routes_api.frontend_tip_top().components.auth.home);

  /**
   * States
   */
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [snackbar, setSnackbar] = useState({
    status: false,
    code: "",
    message: ""
  });
  const [open, setOpen] = useState({
    type_one: false,
    type_two: false,
    type_three: false,
    type_four: false
  });
  const [filter, setFilter] = useState('first_name');
  const [filterText, setFilterText] = useState('');
  const [genres] = useState([
    {
      type: 'female',
      name: 'Niña'
    },
    {
      type: 'male',
      name: 'Niño'
    }
  ]);
  const [roles, setRoles] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [users, setUsers] = useState({
    headers: [
      {
        name: (<FormattedMessage id="DASHBOARD.CONTENT.USERS.LIST.TABLE.USER"></FormattedMessage>)
      },
      {
        name: (<FormattedMessage id="DASHBOARD.CONTENT.USERS.LIST.TABLE.ADMISSION_DATE"></FormattedMessage>)
      },
      {
        name: (<FormattedMessage id="DASHBOARD.CONTENT.USERS.LIST.TABLE.EMAIL"></FormattedMessage>)
      },
      {
        name: (<FormattedMessage id="DASHBOARD.CONTENT.USERS.LIST.TABLE.CHARGE"></FormattedMessage>)
      },
      {
        name: (<FormattedMessage id="DASHBOARD.CONTENT.USERS.LIST.TABLE.ESTATE"></FormattedMessage>)
      },
      // {
      //   name: (<FormattedMessage id="DASHBOARD.CONTENT.USERS.LIST.TABLE.ACTIONS"></FormattedMessage>)
      // }
    ],
    body: []
  });

  /**
   * States form
   */
  const formInitData = {
    role: {
      error: false,
      msj: "",
      data: null,
      type: ['required']
    },
    country: {
      error: false,
      msj: "",
      data: null,
      type: ['required']
    },
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
    email: {
      error: false,
      msj: "",
      data: "",
      type: ['required', 'email', 'min:8']
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
    },
    username: {
      error: false,
      msj: "",
      data: "",
      type: ['required', 'min:5', 'max:20']
    },
    password: {
      error: false,
      msj: "",
      data: "",
      type: ['required', 'min:8', 'max:30', 'strong_password']
    },
    confirmPassword: {
      error: false,
      msj: "",
      data: "",
      type: ['required', 'min:8', 'max:30', 'confirmed:password']
    },
    link: {
      error: false,
      msj: "",
      data: null,
      type: ['']
    },
    admission_date: {
      error: false,
      msj: "",
      data: moment().tz("America/Bogota").format("YYYY-MM-DDTHH:mm"),
      type: ['required']
    }
  }

  const formInitDataStudent = {
    genre: {
      error: false,
      msj: "",
      data: null,
      type: ['required']
    },
    parentFirstName: {
      error: false,
      msj: "",
      data: null,
      type: ['required']
    },
    parentLastName: {
      error: false,
      msj: "",
      data: null,
      type: ['required']
    },
    parentType: {
      error: false,
      msj: "",
      data: null,
      type: ['required']
    },
    preferredTeacher: {
      error: false,
      msj: "",
      data: null,
      type: ['']
    }
  };
  const [isStudent, setIsStudent] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [formData, setFormData] = useState({ ...formInitData });
  const [formDataStudent, setFormDataStudent] = useState({ ...formInitDataStudent });

  /**
   * Constructors
   */
  async function loadData() {
    const token = auth.getToken();
    const response_countries = await backoffice_service().getCountries({ token });
    const response_roles = await backoffice_service().getRoles({ token });
    const response_documents = await backoffice_service().getDocuments({ token });
    const response_teachers = await backoffice_service().getUsers({ token }, { not_paginate: true, role_teacher: true });
    if (response_countries.error) setSnackbar({ status: true, code: "error", message: response_countries.msj });
    if (response_roles.error) setSnackbar({ status: true, code: "error", message: response_roles.msj });
    if (response_documents.error) setSnackbar({ status: true, code: "error", message: response_documents.msj });
    if (response_teachers.error) setSnackbar({ status: true, code: "error", message: response_teachers.msj });
    setCountries([...response_countries.data.data]);
    setDocuments([...response_documents.data.data]);
    setRoles([...response_roles.data.data]);
    setTeachers([...response_teachers.data.data]);
    return handleChangePage(null, 0)
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
  const handleChangePage = async (event, page) => {
    const token = auth.getToken();
    const obj_filter = {};
    if (filterText) obj_filter[filter] = filterText;
    const response = await backoffice_service().getUsers({ token, page }, obj_filter);
    if (response.error) return setSnackbar({ status: true, code: "error", message: response.msj });
    setTotal(response.data.data.count);
    setPage(page);
    const arr_users = users;
    arr_users.body = response.data.data.results.map((el) => {
      return {
        content: [
          {
            name: 'username',
            value: el.username,
            action: null
          },
          {
            name: 'admission_date',
            value: const_roles[el.role.name] === const_roles.ROLE_USER ? `${(el.admission_date.split('T'))[0]} ${((el.admission_date.split('T'))[1]).split(':')[0]}: ${((el.admission_date.split('T'))[1]).split(':')[1]}` : null,
            action: null
          },
          {
            name: 'email',
            value: el.email,
            action: null
          },
          {
            name: 'role',
            value: const_roles[el.role.name],
            action: null
          },
          {
            name: 'state',
            value: `${el.is_active ? 'Activo' : 'Inactivo'}`,
            color: `${el.is_active ? 'primary' : 'secondary'}`,
            action: 'chip'
          },
          // {
          //   action: 'edit',
          //   value: el.id
          // }
        ]
      }
    });
    setUsers({ ...arr_users });
  };

  const findUsersByFilter = (event) => {
    event.preventDefault();
    return handleChangePage(null, 0);
  }
  const handleChangeFilter = (event) => setFilter(event.target.value);
  const handleChangeFilterText = (event) => setFilterText(event.target.value);

  const handleChangeFormData = (property, value) => {
    const form_data_obj = formData;
    form_data_obj[property].data = value;
    setFormData({ ...form_data_obj });
  }
  const handleChangeFormStudentData = (property, value) => {
    const form_data_obj = formDataStudent;
    form_data_obj[property].data = value;
    setFormDataStudent({ ...form_data_obj });
  }
  const handleChangeCountry = async (event, value) => {
    const token = auth.getToken();
    const response_cities = await backoffice_service().getCities({ token }, { country_id: value.id });
    if (response_cities.error) setSnackbar({ status: true, code: "error", message: response_cities.msj });
    setCities([...response_cities.data.data]);
    handleChangeFormData('country', value);
  }
  const handleChangeCity = (event, value) => handleChangeFormData('city', value);
  const handleChangeDocument = (event, value) => handleChangeFormData('documentType', value);
  const handleChangeRole = (event, value) => {
    setIsStudent(false);
    setIsTeacher(false);
    if (value) {
      if (const_roles[value.name] === const_roles.ROLE_USER) setIsStudent(true);
      if (const_roles[value.name] === const_roles.ROLE_TEACHER) setIsTeacher(true);
    }
    handleChangeFormData('role', value);
  };

  const handleChangeGenre = (event, value) => handleChangeFormStudentData('genre', value);
  const handleChangeTeacher = (event, value) => handleChangeFormStudentData('preferredTeacher', value);
  const handleChangeParentFirstNameText = (event) => handleChangeFormStudentData('parentFirstName', event.target.value);
  const handleChangeParentLastNameText = (event) => handleChangeFormStudentData('parentLastName', event.target.value);
  const handleChangeParentTypeText = (event) => handleChangeFormStudentData('parentType', event.target.value);

  const handleChangeDocumentText = (event) => handleChangeFormData('document', event.target.value);
  const handleChangeEmail = (event) => handleChangeFormData('email', event.target.value);
  const handleChangeLink = (event) => handleChangeFormData('link', event.target.value);
  const handleChangeFirstName = (event) => handleChangeFormData('firstName', event.target.value);
  const handleChangeLastName = (event) => handleChangeFormData('lastName', event.target.value);
  const handleChangePhoneNumber = (event) => handleChangeFormData('phoneNumber', event.target.value);
  const handleChangeAddress = (event) => handleChangeFormData('address', event.target.value);
  const handleChangeUsername = (event) => handleChangeFormData('username', event.target.value);
  const handleChangePassword = (event) => handleChangeFormData('password', event.target.value);
  const handleChangeConfirmPassword = (event) => handleChangeFormData('confirmPassword', event.target.value);
  const handleChangeAdmissionDate = (event) => handleChangeFormData("admission_date", event.target.value);

  const handleClick = (event, restart = false) => {
    if (!restart)
      setOpen({
        type_one: event.currentTarget.firstChild.getAttribute('type') === 'one' ? !open.type_one : false,
        type_two: event.currentTarget.firstChild.getAttribute('type') === 'two' ? !open.type_two : false,
        type_three: event.currentTarget.firstChild.getAttribute('type') === 'three' ? !open.type_three : false,
        type_four: event.currentTarget.firstChild.getAttribute('type') === 'four' ? !open.type_four : false
      });
    else
      setOpen({ type_one: false, type_two: false, type_three: false, type_four: false });
  };

  const handleEdit = (event) => {
    let id = event.target.getAttribute('data-id');
    if (!id) id = event.currentTarget.firstChild.firstChild.getAttribute('data-id');
  }

  const handleCloseSnackbar = () =>
    setSnackbar({
      status: false,
      snackbar: "",
      message: ""
    });

  const handleSaveUser = async (event) => {
    event.preventDefault();
    let error = false;
    setFormData({ ...validator(formData) });
    Object.entries(formData).forEach(([key, value]) => { if (value.error) error = true; });
    if (error) return setSnackbar({ status: true, code: "error", message: (<FormattedMessage id="GENERAL.FORM.ERROR.ERRORS.TEXT"></FormattedMessage>) });
    if (isStudent) {
      setFormDataStudent({ ...validator(formDataStudent) });
      Object.entries(formDataStudent).forEach(([key, value]) => { if (value.error) error = true; });
      if (error) return setSnackbar({ status: true, code: "error", message: (<FormattedMessage id="GENERAL.FORM.ERROR.ERRORS.TEXT"></FormattedMessage>) });
    }
    const token = auth.getToken();
    const response = await backoffice_service().createUser({
      data: {
        username: formData.username.data,
        first_name: formData.firstName.data,
        last_name: formData.lastName.data,
        link: formData.link.data,
        email: formData.email.data,
        admission_date: formData.admission_date.data,
        phone_number: formData.phoneNumber.data,
        address: formData.address.data,
        document_number: formData.document.data,
        city_id: formData.city.data.id,
        role_id: formData.role.data.id,
        teacher: formDataStudent.preferredTeacher.data ? formDataStudent.preferredTeacher.data.id : null,
        document_id: formData.documentType.data.id,
        password: formData.password.data,
        password_confirmation: formData.confirmPassword.data,
        genre: formDataStudent.genre.data ? formDataStudent.genre.data.type : null,
        parents: [
          {
            first_name: formDataStudent.parentFirstName.data,
            last_name: formDataStudent.parentLastName.data,
            type_parent: formDataStudent.parentType.data
          }
        ]
      }, token
    });

    if (response.error) return setSnackbar({ status: true, code: "error", message: response.msj });
    setFormData({ ...formInitData });
    setFormDataStudent({ ...formInitDataStudent });
    handleClick(null, true);
    setSnackbar({ status: true, code: "success", message: (<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SUCCESS"></FormattedMessage>) })
    return handleChangePage(null, page);
  }

  return (
    <>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackbar.status} autoHideDuration={10000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.code}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <div
        role="alert"
        className={clsx(
          "alert alert-custom alert-purple alert-shadow gutter-b",
        )}
      >
        <div className="alert-text p-5">
          <h2 className="mb-5">
            <FormattedMessage id="DASHBOARD.CONTENT.USERS.FIND.TITLE"></FormattedMessage>
          </h2>
          <div className={classes.root}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <form onSubmit={findUsersByFilter} noValidate autoComplete="off">
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={10} md={10} lg={10} className="pt-0 pb-0">
                      <FormControl component="fieldset" className="wd-full">
                        <RadioGroup row value={filter} onChange={handleChangeFilter}>
                          <FormControlLabel value={'first_name'} control={<Radio className="text-white" />} label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.FIND.FILTER.NAME"></FormattedMessage>} />
                          <FormControlLabel value={'email'} control={<Radio className="text-white" />} label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.FIND.FILTER.EMAIL"></FormattedMessage>} />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={10} md={10} lg={10} className="pt-0">
                      <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.FIND.NAME.LABEL"></FormattedMessage>} variant="filled" value={filterText} className="wd-full search-text-field" size="small" onChange={handleChangeFilterText} />
                    </Grid>
                    <Grid item xs={6} sm={2} md={2} lg={2} className="pt-0">
                      <Button type={"submit"} variant="contained" color="secondary" size="large" className="btn-secondary btn-block h-40">
                        <FormattedMessage id="DASHBOARD.CONTENT.USERS.FIND.BUTTON"></FormattedMessage>
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4} md={4} lg={4}>
          <div className={`card card-custom card-stretch gutter-b`}>
            {/* Header */}
            <FCEHeader title={<FormattedMessage id="DASHBOARD.CONTENT.USERS.CREATE.TITLE"></FormattedMessage>} subtitle={<FormattedMessage id="DASHBOARD.CONTENT.USERS.CREATE.SUBTITLE"></FormattedMessage>}></FCEHeader>
            {/* Body */}
            <div className="card-body d-flex flex-column">
              <form noValidate autoComplete="off" onSubmit={handleSaveUser}>
                <Grid container>
                  <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    className={classes.list_collapse}
                  >
                    <ListItem button onClick={handleClick}>
                      <ListItemText primary={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FIRST_LEVEL.TITLE"></FormattedMessage>} type={'one'} />
                      {open.type_one ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse className="pl-5 pr-5" in={open.type_one} timeout="auto" unmountOnExit>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FIRST_LEVEL.USER_TYPE"></FormattedMessage></FormLabel>
                          <Autocomplete
                            options={roles}
                            getOptionLabel={(option) => option.name ? const_roles[option.name] : ""}
                            value={formData.role.data}
                            size={'small'}
                            style={{ width: "100%" }}
                            onChange={handleChangeRole}
                            renderInput={(params) => <TextField {...params} label={<FormattedMessage id="GENERAL.FORM.SELECT_OPTION"></FormattedMessage>} variant="outlined" style={{ height: "40px" }} error={formData.role.error} helperText={formData.role.msj} />}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FIRST_LEVEL.DOCUMENT_TYPE"></FormattedMessage></FormLabel>
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
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2 pt-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FIRST_LEVEL.DOCUMENT"></FormattedMessage></FormLabel>
                          <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FIRST_LEVEL.DOCUMENT.LABEL"></FormattedMessage>} value={formData.document.data} variant="outlined" size="small" className="form-text-field mt-2" onChange={handleChangeDocumentText} error={formData.document.error} helperText={formData.document.msj} />
                        </FormControl>
                      </Grid>
                    </Collapse>
                    <ListItem button onClick={handleClick}>
                      <ListItemText primary={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.TITLE"></FormattedMessage>} type={'two'} />
                      {open.type_two ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse className="pl-5 pr-5" in={open.type_two} timeout="auto" unmountOnExit>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.COUNTRY"></FormattedMessage></FormLabel>
                          <Autocomplete
                            options={countries}
                            getOptionLabel={(option) => option.name ? option.name : ""}
                            value={formData.country.data}
                            size={'small'}
                            style={{ width: "100%" }}
                            onChange={handleChangeCountry}
                            renderInput={(params) => <TextField {...params} label={<FormattedMessage id="GENERAL.FORM.SELECT_OPTION"></FormattedMessage>} variant="outlined" style={{ height: "40px" }} error={formData.country.error} helperText={formData.country.msj} />}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.CITY"></FormattedMessage></FormLabel>
                          <Autocomplete
                            options={cities}
                            getOptionLabel={(option) => option.name ? option.name : ""}
                            value={formData.city.data}
                            size={'small'}
                            style={{ width: "100%" }}
                            onChange={handleChangeCity}
                            renderInput={(params) => <TextField {...params} label={<FormattedMessage id="GENERAL.FORM.SELECT_OPTION"></FormattedMessage>} variant="outlined" style={{ height: "40px" }} error={formData.city.error} helperText={formData.city.msj} />}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2 pt-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.NAMES"></FormattedMessage></FormLabel>
                          <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.NAMES.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2" onChange={handleChangeFirstName} value={formData.firstName.data} error={formData.firstName.error} helperText={formData.firstName.msj} />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2 pt-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.LAST_NAMES"></FormattedMessage></FormLabel>
                          <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.LAST_NAMES.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2" onChange={handleChangeLastName} value={formData.lastName.data} error={formData.lastName.error} helperText={formData.lastName.msj} />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2 pt-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.PHONE_NUMBER"></FormattedMessage></FormLabel>
                          <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.PHONE_NUMBER.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2" onChange={handleChangePhoneNumber} value={formData.phoneNumber.data} error={formData.phoneNumber.error} helperText={formData.phoneNumber.msj} />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2 pt-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.ADDRESS"></FormattedMessage></FormLabel>
                          <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.ADDRESS.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2" onChange={handleChangeAddress} value={formData.address.data} error={formData.address.error} helperText={formData.address.msj} />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2 pt-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.EMAIL"></FormattedMessage></FormLabel>
                          <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.EMAIL.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2" onChange={handleChangeEmail} value={formData.email.data} error={formData.email.error} helperText={formData.email.msj} />
                        </FormControl>
                      </Grid>
                      {
                        isTeacher ? (
                          <>
                            <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2 pt-2">
                              <FormControl component="fieldset" className="wd-full">
                                <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.CREATE.VIDEO_URL"></FormattedMessage></FormLabel>
                                <TextField label={'https://example.com'} value={formData.link.data} variant="outlined" size="small" className="form-text-field mt-2" onChange={handleChangeLink} error={formData.link.error} helperText={formData.link.msj} />
                              </FormControl>
                            </Grid>
                          </>
                        ) : (<></>)
                      }
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2 pt-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.ADMISSION_DATE"></FormattedMessage></FormLabel>
                          <TextField
                            label=""
                            variant="outlined"
                            size="small"
                            type="datetime-local"
                            value={formData.admission_date.data}
                            error={formData.admission_date.error}
                            helperText={formData.admission_date.msj}
                            onChange={handleChangeAdmissionDate}
                            className={classes.textField}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Collapse>
                    <ListItem button onClick={handleClick}>
                      <ListItemText primary={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.THIRD_LEVEL.TITLE"></FormattedMessage>} type={'three'} />
                      {open.type_three ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse className="pl-5 pr-5" in={open.type_three} timeout="auto" unmountOnExit>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.THIRD_LEVEL.USERNAME"></FormattedMessage></FormLabel>
                          <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.THIRD_LEVEL.USERNAME.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2" onChange={handleChangeUsername} value={formData.username.data} error={formData.username.error} helperText={formData.username.msj} />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.THIRD_LEVEL.PASSWORD"></FormattedMessage></FormLabel>
                          <TextField type="password" label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.THIRD_LEVEL.PASSWORD.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2" onChange={handleChangePassword} value={formData.password.data} error={formData.password.error} helperText={formData.password.msj} />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.THIRD_LEVEL.PASSWORD_CONFIRM"></FormattedMessage></FormLabel>
                          <TextField type="password" label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.THIRD_LEVEL.PASSWORD.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2" onChange={handleChangeConfirmPassword} value={formData.confirmPassword.data} error={formData.confirmPassword.error} helperText={formData.confirmPassword.msj} />
                        </FormControl>
                      </Grid>
                    </Collapse>

                    {
                      isStudent ? (
                        <>
                          <ListItem button onClick={handleClick}>
                            <ListItemText primary={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FOURTH_LEVEL.TITLE"></FormattedMessage>} type={'four'} />
                            {open.type_four ? <ExpandLess /> : <ExpandMore />}
                          </ListItem>
                          <Collapse className="pl-5 pr-5" in={open.type_four} timeout="auto" unmountOnExit>
                            <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                              <FormControl component="fieldset" className="wd-full">
                                <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FOURTH_LEVEL.TEACHER"></FormattedMessage></FormLabel>
                                <Autocomplete
                                  options={teachers}
                                  getOptionLabel={(option) => option.first_name ? `${option.first_name} ${option.last_name}` : ""}
                                  value={formDataStudent.preferredTeacher.data}
                                  size={'small'}
                                  style={{ width: "100%" }}
                                  onChange={handleChangeTeacher}
                                  renderInput={(params) => <TextField {...params} label={<FormattedMessage id="GENERAL.FORM.SELECT_OPTION"></FormattedMessage>} variant="outlined" style={{ height: "40px" }} error={formDataStudent.preferredTeacher.error} helperText={formDataStudent.preferredTeacher.msj} />}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                              <FormControl component="fieldset" className="wd-full">
                                <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FOURTH_LEVEL.GENRE"></FormattedMessage></FormLabel>
                                <Autocomplete
                                  options={genres}
                                  getOptionLabel={(option) => option.name ? option.name : ""}
                                  value={formDataStudent.genre.data}
                                  size={'small'}
                                  style={{ width: "100%" }}
                                  onChange={handleChangeGenre}
                                  renderInput={(params) => <TextField {...params} label={<FormattedMessage id="GENERAL.FORM.SELECT_OPTION"></FormattedMessage>} variant="outlined" style={{ height: "40px" }} error={formDataStudent.genre.error} helperText={formDataStudent.genre.msj} />}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2 pt-2">
                              <FormControl component="fieldset" className="wd-full">
                                <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FOURTH_LEVEL.PARENT_NAME"></FormattedMessage></FormLabel>
                                <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FOURTH_LEVEL.LABEL"></FormattedMessage>} value={formDataStudent.parentFirstName.data} variant="outlined" size="small" className="form-text-field mt-2" onChange={handleChangeParentFirstNameText} error={formDataStudent.parentFirstName.error} helperText={formDataStudent.parentFirstName.msj} />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2 pt-2">
                              <FormControl component="fieldset" className="wd-full">
                                <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FOURTH_LEVEL.PARENT_LAST_NAME"></FormattedMessage></FormLabel>
                                <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FOURTH_LEVEL.PARENT_LAST_NAME.LABEL"></FormattedMessage>} value={formDataStudent.parentLastName.data} variant="outlined" size="small" className="form-text-field mt-2" onChange={handleChangeParentLastNameText} error={formDataStudent.parentLastName.error} helperText={formDataStudent.parentLastName.msj} />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2 pt-2">
                              <FormControl component="fieldset" className="wd-full">
                                <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FOURTH_LEVEL.TYPE_PARENT"></FormattedMessage></FormLabel>
                                <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FOURTH_LEVEL.TYPE_PARENT.LABEL"></FormattedMessage>} value={formDataStudent.parentType.data} variant="outlined" size="small" className="form-text-field mt-2" onChange={handleChangeParentTypeText} error={formDataStudent.parentType.error} helperText={formDataStudent.parentType.msj} />
                              </FormControl>
                            </Grid>
                          </Collapse>
                        </>
                      ) : (<></>)
                    }
                  </List>
                  <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                    <Button type="submit" variant="contained" className="btn-primary btn-block h-35">
                      <FormattedMessage id="GENERAL.FORM.ACTIONS.SAVE"></FormattedMessage>
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={8} md={8} lg={8}>
          <Table title={<FormattedMessage id="DASHBOARD.CONTENT.USERS.LIST.TITLE"></FormattedMessage>} subtitle={<FormattedMessage id="DASHBOARD.CONTENT.USERS.LIST.SUBTITLE"></FormattedMessage>} className="card-stretch gutter-b" data={users} current_page={page} total={total} onChildEdit={handleEdit} onChildCreate={null} onChildPaginationClick={handleChangePage}></Table>
        </Grid>
      </Grid>
    </>
  );
};
