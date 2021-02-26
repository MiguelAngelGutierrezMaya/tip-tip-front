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
  Snackbar,
  FormGroup,
  Paper,
  Modal
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
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  textField: {
    width: "100%",
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  modal: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
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
  const [openGeneric, setOpenGeneric] = useState({
    create: {
      type_one: false,
      type_two: false,
      type_three: false,
      type_four: false
    },
    edit: {
      type_one: false,
      type_two: false,
      type_three: false,
      type_four: false
    }
  });
  const [filter, setFilter] = useState('first_name');
  const [filterText, setFilterText] = useState('');
  const [openModal, setOpenModal] = useState(false);
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
  const [lessons, setLessons] = useState([]);
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
      {
        name: (<FormattedMessage id="DASHBOARD.CONTENT.USERS.LIST.TABLE.ACTIONS"></FormattedMessage>)
      }
    ],
    body: []
  });

  /**
   * States form
   */
  const formTypes = {
    createType: "create",
    editType: "edit",
  }

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

  const formEditInitData = {
    id: {
      error: false,
      msj: "",
      data: null,
      type: ['required']
    },
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
      type: ['min:8', 'max:30', 'strong_password']
    },
    confirmPassword: {
      error: false,
      msj: "",
      data: "",
      type: ['min:8', 'max:30', 'confirmed:password']
    },
    link: {
      error: false,
      msj: "",
      data: null,
      type: ['']
    },
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
      data: "",
      type: ['required']
    },
    parentLastName: {
      error: false,
      msj: "",
      data: "",
      type: ['required']
    },
    parentType: {
      error: false,
      msj: "",
      data: "",
      type: ['required']
    },
    preferredTeacher: {
      error: false,
      msj: "",
      data: null,
      type: ['']
    },
    currentLesson: {
      error: false,
      msj: "",
      data: null,
      type: ['required']
    },
  };

  const [isStudent, setIsStudent] = useState(false);
  const [isEditStudent, setIsEditStudent] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isEditTeacher, setIsEditTeacher] = useState(false);
  const [formData, setFormData] = useState({ ...formInitData });
  const [formEditData, setFormEditData] = useState(JSON.parse(JSON.stringify(formEditInitData)));
  const [formDataStudent, setFormDataStudent] = useState({ ...formInitDataStudent });
  const [formEditDataStudent, setFormEditDataStudent] = useState(JSON.parse(JSON.stringify(formInitDataStudent)));

  /**
   * Constructors
   */
  async function loadData() {
    const token = auth.getToken();
    const response_countries = await backoffice_service().getCountries({ token });
    const response_roles = await backoffice_service().getRoles({ token });
    const response_documents = await backoffice_service().getDocuments({ token });
    const response_teachers = await backoffice_service().getUsers({ token }, { not_paginate: true, role_teacher: true });
    const response_lessons = await backoffice_service().getLessons({ token },{ not_paginate: true, many: true });
    if (response_countries.error) setSnackbar({ status: true, code: "error", message: response_countries.msj });
    if (response_roles.error) setSnackbar({ status: true, code: "error", message: response_roles.msj });
    if (response_documents.error) setSnackbar({ status: true, code: "error", message: response_documents.msj });
    if (response_teachers.error) setSnackbar({ status: true, code: "error", message: response_teachers.msj });
    if (response_lessons.error) setSnackbar({ status: true, code: "error", message: response_lessons.msj });
    setCountries([...response_countries.data.data]);
    setDocuments([...response_documents.data.data]);
    setRoles([...response_roles.data.data]);
    setTeachers([...response_teachers.data.data]);
    setLessons([...response_lessons.data.data]);
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
          {
            action: 'edit',
            value: el.id
          }
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

  let handleOpenModal = () => setOpenModal(true);
  let handleCloseModal = () => setOpenModal(false);

  const handleChangeGenericFormData = (property, value, formType) => {
    let form_data_obj = null;

    if(formType == formTypes.createType){
      form_data_obj = formData;
    } else if(formType == formTypes.editType){
      form_data_obj = formEditData;
    }

    if(form_data_obj != null){
      form_data_obj[property].data = value;
      if(formType == formTypes.createType){
        setFormData({ ...form_data_obj });
      } else {
        setFormEditData({ ...form_data_obj });
      }
    }
  }

  const handleChangeGenericFormStudentData = (property, value, formType) => {
    let form_data_obj = null;

    if(formType == formTypes.createType){
      form_data_obj = formDataStudent;
    } else if(formType == formTypes.editType){
      form_data_obj = formEditDataStudent;
    }

    if(form_data_obj != null){
      form_data_obj[property].data = value;
      if(formType == formTypes.createType){
        setFormDataStudent({ ...form_data_obj });
      } else {
        setFormEditDataStudent({ ...form_data_obj });
      }
    }
  }
  const handleChangeFormStudentData = (property, value) => {
    const form_data_obj = formDataStudent;
    form_data_obj[property].data = value;
    setFormDataStudent({ ...form_data_obj });
  }
  const handleChangeCountry = async (value, formType) => {
    const token = auth.getToken();
    const response_cities = await backoffice_service().getCities({ token }, { country_id: value.id });
    if (response_cities.error) setSnackbar({ status: true, code: "error", message: response_cities.msj });
    setCities([...response_cities.data.data]);
    handleChangeGenericFormData('country', value, formType);
  }
  const handleChangeCity = (value, formType) => handleChangeGenericFormData('city', value, formType);
  const handleChangeDocument = (value, formType) => handleChangeGenericFormData('documentType', value, formType);
  const handleChangeRole = (value, formType) => {
    if(formType == formTypes.createType){
      setIsStudent(false);
      setIsTeacher(false);
    } else {
      setIsEditStudent(false);
      setIsEditTeacher(false);
    }

    if (value) {
      if (const_roles[value.name] === const_roles.ROLE_USER) formType == formTypes.createType? setIsStudent(true) : setIsEditStudent(true);
      if (const_roles[value.name] === const_roles.ROLE_TEACHER) formType == formTypes.createType? setIsTeacher(true) : setIsEditTeacher(true);
    }
    handleChangeGenericFormData('role', value, formType);
  };

  const handleChangeGenre = (value, formType) => handleChangeGenericFormStudentData('genre', value, formType);
  const handleChangeTeacher = (value, formType) => handleChangeGenericFormStudentData('preferredTeacher', value, formType);
  const handleChangeLesson = (value, formType) => handleChangeGenericFormStudentData('currentLesson', value, formType);
  const handleChangeParentFirstNameText = (value, formType) => handleChangeGenericFormStudentData('parentFirstName', value, formType);
  const handleChangeParentLastNameText = (value, formType) => handleChangeGenericFormStudentData('parentLastName', value, formType);
  const handleChangeParentTypeText = (value, formType) => handleChangeGenericFormStudentData('parentType', value, formType);

  const handleChangeDocumentText = (value, formType) => handleChangeGenericFormData('document', value, formType);
  const handleChangeEmail = (value, formType) => handleChangeGenericFormData('email', value, formType);
  const handleChangeLink = (value, formType) => handleChangeGenericFormData('link', value, formType);
  const handleChangeFirstName = (value, formType) => handleChangeGenericFormData('firstName', value, formType);
  const handleChangeLastName = (value, formType) => handleChangeGenericFormData('lastName', value, formType);
  const handleChangePhoneNumber = (value, formType) => handleChangeGenericFormData('phoneNumber', value, formType);
  const handleChangeAddress = (value, formType) => handleChangeGenericFormData('address', value, formType);
  const handleChangeUsername = (value, formType) => handleChangeGenericFormData('username', value, formType);
  const handleChangePassword = (value, formType) => handleChangeGenericFormData('password', value, formType);
  const handleChangeConfirmPassword = (value, formType) => handleChangeGenericFormData('confirmPassword', value, formType);
  const handleChangeAdmissionDate = (value, formType) => handleChangeGenericFormData("admission_date", value, formType);

  const handleClickGeneric = (event, restart = false) => {
    if (!restart){
      let type = event.currentTarget.firstChild.getAttribute('data-formtype');
      setOpenGeneric({
        create: {
          type_one: event.currentTarget.firstChild.getAttribute('type') === 'one' && type == formTypes.createType ? !openGeneric.create.type_one : false,
          type_two: event.currentTarget.firstChild.getAttribute('type') === 'two' && type == formTypes.createType ? !openGeneric.create.type_two : false,
          type_three: event.currentTarget.firstChild.getAttribute('type') === 'three' && type == formTypes.createType ? !openGeneric.create.type_three : false,
          type_four: event.currentTarget.firstChild.getAttribute('type') === 'four' && type == formTypes.createType ? !openGeneric.create.type_four : false
        },
        edit: {
          type_one: event.currentTarget.firstChild.getAttribute('type') === 'one' && type == formTypes.editType ? !openGeneric.edit.type_one : false,
          type_two: event.currentTarget.firstChild.getAttribute('type') === 'two' && type == formTypes.editType ? !openGeneric.edit.type_two : false,
          type_three: event.currentTarget.firstChild.getAttribute('type') === 'three' && type == formTypes.editType ? !openGeneric.edit.type_three : false,
          type_four: event.currentTarget.firstChild.getAttribute('type') === 'four' && type == formTypes.editType ? !openGeneric.edit.type_four : false
        }
      });
    } else {
      setOpenGeneric({
        create: {type_one: false, type_two: false, type_three: false, type_four: false},
        edit: {type_one: false, type_two: false, type_three: false, type_four: false}
      });
    }
  };

  const handleEdit = async (event) => {
    const token = auth.getToken();

    let id = event.target.getAttribute('data-id');
    if (!id) id = event.currentTarget.firstChild.firstChild.getAttribute('data-id');

    const response_user = await backoffice_service().getUsers({ token, page: 0 }, { not_paginate: true, id: id });

    if(response_user.data.data && response_user.data.data.length){
      const user = response_user.data.data[0];

      //seteamos los valores del usuario
      handleChangeGenericFormData('id', user.id, formTypes.editType);
      await handleChangeCountry(user.city.state.country, formTypes.editType)
      handleChangeRole(user.role, formTypes.editType);
      handleChangeDocument(user.document, formTypes.editType);
      handleChangeDocumentText(user.document_number, formTypes.editType);
      handleChangeCity(user.city, formTypes.editType);
      handleChangeFirstName(user.first_name, formTypes.editType);
      handleChangeLastName(user.last_name, formTypes.editType);
      handleChangePhoneNumber(user.phone_number, formTypes.editType);
      handleChangeAddress(user.address, formTypes.editType);
      handleChangeEmail(user.email, formTypes.editType);
      handleChangeLink(user.link, formTypes.editType);
      // handleChangeAdmissionDate(user.admission_date, formTypes.editType);
      handleChangeUsername(user.username, formTypes.editType);

      //Si es Estudiante
      if(const_roles[user.role.name] === const_roles.ROLE_USER){
        const response_estudent = await backoffice_service().getStudents({ token, page: 0 }, { user: user.id });
        const student = response_estudent.data.data[0];
        const response_teacher = await backoffice_service().getUsers({ token, page: 0 }, { not_paginate: true, id: student.teacher });
        const teacher = response_teacher.data.data[0];
        const response_parent = await backoffice_service().getParents({ token, page: 0 }, { student: student.id });
        const parent = response_parent.data.data[0];

        handleChangeGenre(genres.find(el => el.type.toLowerCase() == student.genre.toLowerCase()), formTypes.editType);
        handleChangeTeacher(teacher, formTypes.editType);
        handleChangeLesson(student.current_lesson, formTypes.editType);
        handleChangeParentFirstNameText(parent.first_name, formTypes.editType);
        handleChangeParentLastNameText(parent.last_name, formTypes.editType);
        handleChangeParentTypeText(parent.type_parent, formTypes.editType);
      }
    }
    return handleOpenModal();
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
        current_lesson_id: formDataStudent.currentLesson.data ? formDataStudent.currentLesson.data.id : null,
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
    handleClickGeneric(null, true);
    setSnackbar({ status: true, code: "success", message: (<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SUCCESS"></FormattedMessage>) })
    return handleChangePage(null, page);
  }

  const handleEditUser = async (event) => {
    event.preventDefault();
    let error = false;
    setFormEditData({ ...validator(formEditData) });
    Object.entries(formEditData).forEach(([key, value]) => { if (value.error) error = true; });
    if (error) return setSnackbar({ status: true, code: "error", message: (<FormattedMessage id="GENERAL.FORM.ERROR.ERRORS.TEXT"></FormattedMessage>) });
    if (isEditStudent) {
      setFormEditDataStudent({ ...validator(formEditDataStudent) });
      Object.entries(formEditDataStudent).forEach(([key, value]) => { if (value.error) error = true; });
      if (error) return setSnackbar({ status: true, code: "error", message: (<FormattedMessage id="GENERAL.FORM.ERROR.ERRORS.TEXT"></FormattedMessage>) });
    }
    const token = auth.getToken();
    const response = await backoffice_service().editFullUser({
      data: {
        id: formEditData.id.data,
        username: formEditData.username.data,
        first_name: formEditData.firstName.data,
        last_name: formEditData.lastName.data,
        link: formEditData.link.data,
        email: formEditData.email.data,
        phone_number: formEditData.phoneNumber.data,
        address: formEditData.address.data,
        document_number: formEditData.document.data,
        city_id: formEditData.city.data.id,
        role_id: formEditData.role.data.id,
        teacher: formEditDataStudent.preferredTeacher.data ? formEditDataStudent.preferredTeacher.data.id : null,
        current_lesson_id: formEditDataStudent.currentLesson.data ? formEditDataStudent.currentLesson.data.id : null,
        document_id: formEditData.documentType.data.id,
        password: formEditData.password.data,
        password_confirmation: formEditData.confirmPassword.data,
        genre: formEditDataStudent.genre.data ? formEditDataStudent.genre.data.type : null,
        parents: [
          {
            first_name: formEditDataStudent.parentFirstName.data,
            last_name: formEditDataStudent.parentLastName.data,
            type_parent: formEditDataStudent.parentType.data
          }
        ]
      }, token
    });

    if (response.error) return setSnackbar({ status: true, code: "error", message: response.msj });
    setFormEditData(JSON.parse(JSON.stringify(formEditInitData)));
    setFormEditDataStudent(JSON.parse(JSON.stringify(formInitDataStudent)));
    handleClickGeneric(null, true);
    handleCloseModal();
    setSnackbar({ status: true, code: "success", message: (<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.EDIT_FORM.SUCCESS"></FormattedMessage>) })
    return handleChangePage(null, page);
  }

  const userForm = (xsCols, smCols, mdCols, lgCols, formType, formData, formDataStudent, isStudent, isTeacher) => {
    return (
      <Grid item xs={xsCols} sm={smCols} md={mdCols} lg={lgCols}>
          <div className={`card card-custom card-stretch gutter-b`}>
            {/* Header */}
            <FCEHeader title={<FormattedMessage id={formType == formTypes.createType? "DASHBOARD.CONTENT.USERS.CREATE.TITLE" : "DASHBOARD.CONTENT.USERS.EDIT.TITLE"}></FormattedMessage>} subtitle={<FormattedMessage id="DASHBOARD.CONTENT.USERS.CREATE.SUBTITLE"></FormattedMessage>}></FCEHeader>
            {/* Body */}
            <div className="card-body d-flex flex-column">
              <form noValidate autoComplete="off" onSubmit={formType == formTypes.createType? handleSaveUser : handleEditUser}>
                <Grid container>
                  <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    className={classes.list_collapse}
                  >
                    <ListItem button onClick={handleClickGeneric} className="wd-full">
                      <ListItemText primary={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FIRST_LEVEL.TITLE"></FormattedMessage>} type={'one'} data-formtype={formType} />
                      {openGeneric[formType].type_one ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse className="pl-5 pr-5" style={{ maxHeight: '420px', overflowY: 'auto' }} in={openGeneric[formType].type_one} timeout="auto" unmountOnExit>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FIRST_LEVEL.USER_TYPE"></FormattedMessage></FormLabel>
                          <Autocomplete
                            options={roles}
                            getOptionLabel={(option) => option.name ? const_roles[option.name] : ""}
                            value={formData.role.data}
                            size={'small'}
                            style={{ width: "100%" }}
                            onChange={(e, val) => handleChangeRole(val, formType)}
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
                            onChange={(e, val) => handleChangeDocument(val, formType)}
                            renderInput={(params) => <TextField {...params} label={<FormattedMessage id="GENERAL.FORM.SELECT_OPTION"></FormattedMessage>} variant="outlined" style={{ height: "40px" }} error={formData.documentType.error} helperText={formData.documentType.msj} />}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2 pt-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FIRST_LEVEL.DOCUMENT"></FormattedMessage></FormLabel>
                          <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FIRST_LEVEL.DOCUMENT.LABEL"></FormattedMessage>}
                                     value={formData.document.data}
                                     onChange={(e) => handleChangeDocumentText(e.target.value, formType)}
                                     variant="outlined" size="small" className="form-text-field mt-2"
                                     error={formData.document.error} helperText={formData.document.msj} />
                        </FormControl>
                      </Grid>
                    </Collapse>
                    <ListItem button onClick={handleClickGeneric}>
                      <ListItemText primary={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.TITLE"></FormattedMessage>} type={'two'} data-formtype={formType} />
                      {openGeneric[formType].type_two ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse className="pl-5 pr-5" style={{ maxHeight: '420px', overflowY: 'auto' }} in={openGeneric[formType].type_two} timeout="auto" unmountOnExit>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.COUNTRY"></FormattedMessage></FormLabel>
                          <Autocomplete
                            options={countries}
                            getOptionLabel={(option) => option.name ? option.name : ""}
                            value={formData.country.data}
                            size={'small'}
                            style={{ width: "100%" }}
                            onChange={(e, val) => handleChangeCountry(val, formType)}
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
                            onChange={(e, val) => handleChangeCity(val, formType)}
                            renderInput={(params) => <TextField {...params} label={<FormattedMessage id="GENERAL.FORM.SELECT_OPTION"></FormattedMessage>} variant="outlined" style={{ height: "40px" }} error={formData.city.error} helperText={formData.city.msj} />}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2 pt-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.NAMES"></FormattedMessage></FormLabel>
                          <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.NAMES.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2"
                                     value={formData.firstName.data}
                                     onChange={(e) => handleChangeFirstName(e.target.value, formType)}
                                     error={formData.firstName.error}
                                     helperText={formData.firstName.msj} />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2 pt-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.LAST_NAMES"></FormattedMessage></FormLabel>
                          <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.LAST_NAMES.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2"
                                     value={formData.lastName.data}
                                     onChange={(e) => handleChangeLastName(e.target.value, formType)}
                                     error={formData.lastName.error}
                                     helperText={formData.lastName.msj} />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2 pt-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.PHONE_NUMBER"></FormattedMessage></FormLabel>
                          <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.PHONE_NUMBER.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2"
                                     value={formData.phoneNumber.data}
                                     onChange={(e) => handleChangePhoneNumber(e.target.value, formType)}
                                     error={formData.phoneNumber.error}
                                     helperText={formData.phoneNumber.msj} />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2 pt-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.ADDRESS"></FormattedMessage></FormLabel>
                          <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.ADDRESS.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2"
                                     value={formData.address.data}
                                     onChange={(e) => handleChangeAddress(e.target.value, formType)}
                                     error={formData.address.error}
                                     helperText={formData.address.msj} />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2 pt-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.EMAIL"></FormattedMessage></FormLabel>
                          <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.EMAIL.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2"
                                     value={formData.email.data}
                                     onChange={(e) => handleChangeEmail(e.target.value, formType)}
                                     error={formData.email.error}
                                     helperText={formData.email.msj} />
                        </FormControl>
                      </Grid>
                      {
                        isTeacher ? (
                          <>
                            <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2 pt-2">
                              <FormControl component="fieldset" className="wd-full">
                                <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.CALENDAR.CREATE.VIDEO_URL"></FormattedMessage></FormLabel>
                                <TextField label={'https://example.com'} variant="outlined" size="small" className="form-text-field mt-2"
                                           value={formData.link.data}
                                           onChange={(e) => handleChangeLink(e.target.value, formType)}
                                           error={formData.link.error}
                                           helperText={formData.link.msj} />
                              </FormControl>
                            </Grid>
                          </>
                        ) : (<></>)
                      }
                      {
                        formType == formTypes.createType ? (
                            <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2 pt-2">
                              <FormControl component="fieldset" className="wd-full">
                                <FormLabel component="legend"><FormattedMessage
                                    id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.SECOND_LEVEL.ADMISSION_DATE"></FormattedMessage></FormLabel>
                                <TextField
                                    label=""
                                    variant="outlined"
                                    size="small"
                                    type="datetime-local"
                                    value={formData.admission_date.data}
                                    error={formData.admission_date.error}
                                    helperText={formData.admission_date.msj}
                                    onChange={(e) => handleChangeAdmissionDate(e.target.value, formType)}
                                    className={classes.textField}
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                />
                              </FormControl>
                            </Grid>
                        ) : (<></>)
                      }
                    </Collapse>
                    <ListItem button onClick={handleClickGeneric}>
                      <ListItemText primary={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.THIRD_LEVEL.TITLE"></FormattedMessage>} type={'three'} data-formtype={formType} />
                      {openGeneric[formType].type_three ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse className="pl-5 pr-5" style={{ maxHeight: '420px', overflowY: 'auto' }} in={openGeneric[formType].type_three} timeout="auto" unmountOnExit>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.THIRD_LEVEL.USERNAME"></FormattedMessage></FormLabel>
                          <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.THIRD_LEVEL.USERNAME.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2"
                                     value={formData.username.data}
                                     onChange={(e) => handleChangeUsername(e.target.value, formType)}
                                     error={formData.username.error}
                                     helperText={formData.username.msj} />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.THIRD_LEVEL.PASSWORD"></FormattedMessage></FormLabel>
                          <TextField type="password" label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.THIRD_LEVEL.PASSWORD.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2"
                                     value={formData.password.data}
                                     onChange={(e) => handleChangePassword(e.target.value, formType)}
                                     error={formData.password.error}
                                     helperText={formData.password.msj} />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                        <FormControl component="fieldset" className="wd-full">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.THIRD_LEVEL.PASSWORD_CONFIRM"></FormattedMessage></FormLabel>
                          <TextField type="password" label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.THIRD_LEVEL.PASSWORD.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2"
                                     value={formData.confirmPassword.data}
                                     onChange={(e) => handleChangeConfirmPassword(e.target.value, formType)}
                                     error={formData.confirmPassword.error}
                                     helperText={formData.confirmPassword.msj} />
                        </FormControl>
                      </Grid>
                    </Collapse>
                    {
                      isStudent ? (
                        <>
                          <ListItem button onClick={handleClickGeneric}>
                            <ListItemText primary={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FOURTH_LEVEL.TITLE"></FormattedMessage>} type={'four'} data-formtype={formType} />
                            {openGeneric[formType].type_four ? <ExpandLess /> : <ExpandMore />}
                          </ListItem>
                          <Collapse className="pl-5 pr-5" style={{ maxHeight: '420px', overflowY: 'auto' }} in={openGeneric[formType].type_four} timeout="auto" unmountOnExit>
                            <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                              <FormControl component="fieldset" className="wd-full">
                                <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FOURTH_LEVEL.TEACHER"></FormattedMessage></FormLabel>
                                <Autocomplete
                                  options={teachers}
                                  getOptionLabel={(option) => option.first_name ? `${option.first_name} ${option.last_name}` : ""}
                                  value={formDataStudent.preferredTeacher.data}
                                  size={'small'}
                                  style={{ width: "100%" }}
                                  onChange={(e, val) => handleChangeTeacher(val, formType)}
                                  renderInput={(params) => <TextField {...params} label={<FormattedMessage id="GENERAL.FORM.SELECT_OPTION"></FormattedMessage>} variant="outlined" style={{ height: "40px" }} error={formDataStudent.preferredTeacher.error} helperText={formDataStudent.preferredTeacher.msj} />}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                              <FormControl component="fieldset" className="wd-full">
                                <FormLabel component="legend"><FormattedMessage id={formType == formTypes.createType? "DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FOURTH_LEVEL.FIRST_LESSON" : "DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FOURTH_LEVEL.CURRENT_LESSON"}></FormattedMessage></FormLabel>
                                <Autocomplete
                                  options={lessons}
                                  getOptionLabel={(option) => option.title ? `${option.title} - ${option.unit.name} - ${option.unit.level.name}` : ""}
                                  value={formDataStudent.currentLesson.data}
                                  size={'small'}
                                  style={{ width: "100%" }}
                                  onChange={(e, val) => handleChangeLesson(val, formType)}
                                  renderInput={(params) => <TextField {...params} label={<FormattedMessage id="GENERAL.FORM.SELECT_OPTION"></FormattedMessage>} variant="outlined" style={{ height: "40px" }} error={formDataStudent.currentLesson.error} helperText={formDataStudent.currentLesson.msj} />}
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
                                  onChange={(e, val) => handleChangeGenre(val, formType)}
                                  renderInput={(params) => <TextField {...params} label={<FormattedMessage id="GENERAL.FORM.SELECT_OPTION"></FormattedMessage>} variant="outlined" style={{ height: "40px" }} error={formDataStudent.genre.error} helperText={formDataStudent.genre.msj} />}
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2 pt-2">
                              <FormControl component="fieldset" className="wd-full">
                                <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FOURTH_LEVEL.PARENT_NAME"></FormattedMessage></FormLabel>
                                <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FOURTH_LEVEL.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2"
                                           value={formDataStudent.parentFirstName.data}
                                           onChange={(e) => handleChangeParentFirstNameText(e.target.value, formType)}
                                           error={formDataStudent.parentFirstName.error}
                                           helperText={formDataStudent.parentFirstName.msj} />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2 pt-2">
                              <FormControl component="fieldset" className="wd-full">
                                <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FOURTH_LEVEL.PARENT_LAST_NAME"></FormattedMessage></FormLabel>
                                <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FOURTH_LEVEL.PARENT_LAST_NAME.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2"
                                           value={formDataStudent.parentLastName.data}
                                           onChange={(e) => handleChangeParentLastNameText(e.target.value, formType)}
                                           error={formDataStudent.parentLastName.error}
                                           helperText={formDataStudent.parentLastName.msj} />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2 pt-2">
                              <FormControl component="fieldset" className="wd-full">
                                <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FOURTH_LEVEL.TYPE_PARENT"></FormattedMessage></FormLabel>
                                <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.USERS.COLLAPSE.FORM.FOURTH_LEVEL.TYPE_PARENT.LABEL"></FormattedMessage>} variant="outlined" size="small" className="form-text-field mt-2"
                                           value={formDataStudent.parentType.data}
                                           onChange={(e) => handleChangeParentTypeText(e.target.value, formType)}
                                           error={formDataStudent.parentType.error}
                                           helperText={formDataStudent.parentType.msj} />
                              </FormControl>
                            </Grid>
                          </Collapse>
                        </>
                      ) : (<></>)
                    }
                  </List>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                  <Button type="submit" variant="contained" className="btn-primary btn-block h-35">
                    <FormattedMessage id="GENERAL.FORM.ACTIONS.SAVE"></FormattedMessage>
                  </Button>
                </Grid>
              </form>
            </div>
          </div>
        </Grid>
    );
  }

  return (
    <>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackbar.status} autoHideDuration={10000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.code}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={openModal}
        onClose={handleCloseModal}
      >
        <div className={`${classes.modal} modal-file`}>
          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <FormGroup>
                <FormControl component="fieldset">
                  <div className={`card card-custom card-stretch gutter-b`}>
                    <div className="card-body p-0">
                      <div className="tab-content">
                        <section className={`${classes.fullWidth} mt-4`}>
                          <Grid container spacing={3}>
                            {userForm(12, 12, 12, 12, formTypes.editType, formEditData, formEditDataStudent, isEditStudent, isEditTeacher)}
                          </Grid>
                        </section>
                      </div>
                    </div>
                  </div>
                </FormControl>
              </FormGroup>
            </Grid>
          </Grid>
        </div>
      </Modal>

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
        {userForm(12, 4, 4, 4, formTypes.createType, formData, formDataStudent, isStudent, isTeacher)}
        <Grid item xs={12} sm={8} md={8} lg={8}>
          <Table title={<FormattedMessage id="DASHBOARD.CONTENT.USERS.LIST.TITLE"></FormattedMessage>} subtitle={<FormattedMessage id="DASHBOARD.CONTENT.USERS.LIST.SUBTITLE"></FormattedMessage>} className="card-stretch gutter-b" data={users} current_page={page} total={total} onChildEdit={handleEdit} onChildCreate={null} onChildPaginationClick={handleChangePage}></Table>
        </Grid>
      </Grid>
    </>
  );
};
