import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

/**
 * Utils
 */
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

/**
 * Components
 */
import { Table, FCEHeader } from '../../components'
import { Autocomplete } from '@material-ui/lab';
import {
  Table as TableFile,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
  Button,
  TextField,
  FormGroup,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Typography,
  CircularProgress,
  Snackbar,
  Modal
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Dropzone from 'react-dropzone';
import { FormattedMessage } from "react-intl";

/**
 * Icons
 */
import { Publish, Delete, Schedule, CheckCircleOutline, Error } from '@material-ui/icons';

/**
 * Services
 */
import { backoffice_service } from './../../services/http/requests/index';
import routes_api from "./../../services/http/requests/routes-api";
import auth from './../../services/auth';
import validator from './../../services/validation';

/**
 * Color styles
 */
import { getInitLayoutConfig } from "./../../../_metronic/layout/_core/LayoutConfig"


const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  root: {
    flexGrow: 1
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
  fullWidth: {
    width: '100%'
  },
  dropzone: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: '2px',
    borderRadius: '20px',
    borderColor: getInitLayoutConfig().js.colors.theme.base.light,
    backgroundColor: getInitLayoutConfig().js.colors.theme.base.light,
    color: getInitLayoutConfig().js.colors.theme.base.black,
    outline: 'none',
    transition: 'border .24s ease -in -out',
    cursor: 'pointer',
  },
  thead: {
    fontWeight: 600,
  },
  table: {
    width: "100%",
  }
}));

export const LeIndex = () => {

  const classes = useStyles();
  const history = useHistory();
  const permisision = auth.getPermission('Materiales', 'Lecciones', false);
  if (!permisision) history.push(routes_api.frontend_tip_top().components.auth.home);

  /**
   * States
   */
  const [page, setPage] = useState(0);
  const [pageMaterials, setPageMaterials] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalMaterials, setTotalMaterials] = useState(0);
  const [filterText, setFilterText] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    status: false,
    code: "",
    message: ""
  });

  const [units, setUnits] = useState([]);
  const [materials, setMaterials] = useState({
    headers: [
      {
        name: (<FormattedMessage id="DASHBOARD.CONTENT.MATERIALS.LIST.TABLE.NAME"></FormattedMessage>)
      },
      {
        name: (<FormattedMessage id="DASHBOARD.CONTENT.MATERIALS.LIST.TABLE.LESSON"></FormattedMessage>)
      },
      {
        name: (<FormattedMessage id="DASHBOARD.CONTENT.MATERIALS.LIST.TABLE.MATERIAL"></FormattedMessage>)
      },
      {
        name: (<FormattedMessage id="DASHBOARD.CONTENT.MATERIALS.LIST.TABLE.ACTIONS"></FormattedMessage>)
      }
    ],
    body: []
  });
  const [lessons, setLessons] = useState({
    headers: [
      {
        name: (<FormattedMessage id="DASHBOARD.CONTENT.LESSONS.LIST.TABLE.CODE"></FormattedMessage>)
      },
      {
        name: (<FormattedMessage id="DASHBOARD.CONTENT.LESSONS.LIST.TABLE.NAME"></FormattedMessage>)
      },
      {
        name: (<FormattedMessage id="DASHBOARD.CONTENT.LESSONS.LIST.TABLE.UNIT"></FormattedMessage>)
      },
      {
        name: (<FormattedMessage id="DASHBOARD.CONTENT.LESSONS.LIST.TABLE.LEVEL"></FormattedMessage>)
      },
      {
        name: (<FormattedMessage id="DASHBOARD.CONTENT.LESSONS.LIST.TABLE.LAST_LESSON"></FormattedMessage>)
      },
      {
        name: (<FormattedMessage id="DASHBOARD.CONTENT.LESSONS.LIST.TABLE.IS_LAST"></FormattedMessage>)
      },
      {
        name: (<FormattedMessage id="DASHBOARD.CONTENT.LESSONS.LIST.TABLE.ACTIONS"></FormattedMessage>)
      }
    ],
    body: []
  });

  /**
     * FormData Files States
     */
  const formInitData = {
    unit: {
      error: false,
      msj: "",
      data: null,
      type: ['required']
    },
    title: {
      error: false,
      msj: "",
      data: "",
      type: ['required', 'min:3']
    },
    parent: {
      error: false,
      msj: "",
      data: "",
      type: ['required']
    },
    last_lesson: {
      error: false,
      msj: "",
      data: false,
      type: []
    }
  }
  const [formData, setFormData] = useState({ ...formInitData });
  const [lesson, setLesson] = useState(0);
  const [files, setFiles] = useState([]);


  /**
   * Constructors
   */
  async function updateParent() {
    const token = auth.getToken();
    const parent = await backoffice_service().getLessons({ token, page: 0 }, { not_paginate: true, last_lesson: true });
    if (parent.error) setSnackbar({ status: true, code: "error", message: parent.msj });
    handleChangeParent(parent.data.data);
  }

  async function loadData() {
    const token = auth.getToken();
    const response_units = await backoffice_service().getUnits({ token, page: 0 }, { not_paginate: true });
    await updateParent();
    if (response_units.error) setSnackbar({ status: true, code: "error", message: response_units.msj });
    setUnits([...response_units.data.data]);
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

  const buildObjectFiles = (acceptedFiles) => {
    let value = []
    acceptedFiles.forEach((file) => {
      value = [...value, { file: file, status: 0 }]
    });
    return value;
  }

  let handleRemoveFile = (file, array) => {
    const newFiles = [...array]
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles);
  }

  const handleOnDropAccepted = (acceptedFiles) => setFiles([...files, ...buildObjectFiles(acceptedFiles)]);
  const handleOnDropRejected = () => setSnackbar({ status: true, code: "error", message: <FormattedMessage id="DASHBOARD.CONTENT.MATERIALS.ERRORS.NOT_ACCEPTED"></FormattedMessage> });

  const handleChangePage = async (event, page) => {
    const token = auth.getToken();
    const obj_filter = {};
    if (filterText) obj_filter["title"] = filterText;
    const response = await backoffice_service().getLessons({ token, page }, obj_filter);
    if (response.error) return setSnackbar({ status: true, code: "error", message: response.msj });
    setTotal(response.data.data.count);
    setPage(page);
    const arr_lessons = lessons;
    arr_lessons.body = response.data.data.results.map((el) => {
      return {
        content: [
          {
            name: 'id',
            value: el.id,
            action: null
          },
          {
            name: 'name',
            value: el.title,
            action: null
          },
          {
            name: 'unit',
            value: el.unit.name,
            action: null
          },
          {
            name: 'level',
            value: el.unit.level.name,
            action: null
          },
          {
            name: 'parent',
            value: el.parent ? el.parent.title : null,
            action: null
          },
          {
            name: 'is_last',
            value: el.is_last,
            action: 'state',
            component: (key, handleEvent) =>
              el.is_last ? (
                <td key={`is-last-${key}`}>
                  <IconButton color="default" aria-label="Edit" component="span" onClick={() => handleEvent}>
                    <i className="flaticon-medal text-purple"></i>
                  </IconButton>
                </td>
              ) : (
                  <td key={`is-last-${key}`}></td>
                )
          },
          {
            // action: 'edit,file',
            action: 'file',
            value: el.id
          }
        ]
      }
    });
    setLessons({ ...arr_lessons });
  };

  const handleChangePageMaterials = async (event, lesson_id, page) => {
    const token = auth.getToken();
    const response = await backoffice_service().getMaterials({
      token,
      lesson_id,
      page
    });
    if (response.error) return setSnackbar({ status: true, code: "error", message: response.msj });
    setTotalMaterials(response.data.data.count);
    setPageMaterials(page);
    const arr_materials = materials;
    arr_materials.body = response.data.data.results.map((el) => {
      return {
        content: [
          {
            name: 'name',
            value: el.name,
            action: null
          },
          {
            name: 'lesson',
            value: el.lesson ? el.lesson.title : null,
            action: null
          },
          {
            action: "href",
            value: el.url,
            text: "Ver material"
          },
          {
            action: 'delete',
            value: el.id
          }
        ]
      }
    });
    setMaterials({ ...arr_materials });
  };

  const handlePreChangePageMaterials = (event, page) => handleChangePageMaterials(event, lesson, page);

  const findLessonByFilter = (event) => {
    event.preventDefault();
    return handleChangePage(null, 0);
  }
  const handleChangeFilterText = (event) => setFilterText(event.target.value);

  const handleChangeFormData = (property, value) => {
    const form_data_obj = formData;
    form_data_obj[property].data = value;
    setFormData({ ...form_data_obj });
  }

  const handleChangeLastLesson = (event) => handleChangeFormData('last_lesson', event.target.value === 'true');
  const handleChangeUnit = (event, value) => handleChangeFormData('unit', value);
  const handleChangeTitle = (event) => handleChangeFormData('title', event.target.value);
  const handleChangeParent = (obj) => handleChangeFormData('parent', obj);

  const handleEdit = (event) => {
    console.log(event.target.getAttribute('data-id'));
  }

  const handleUploadMaterial = async (event) => {
    const lesson_id = Number(event.currentTarget.firstChild.firstChild.getAttribute('data-id'));
    setLesson(lesson_id)
    handleChangePageMaterials(null, lesson_id, 0);
    return handleOpenModal();
  }

  let handleOpenModal = () => setOpenModal(true);
  let handleCloseModal = () => setOpenModal(false);

  const handleCloseSnackbar = () =>
    setSnackbar({
      status: false,
      snackbar: "",
      message: ""
    });

  const handleDeleteMaterial = async (event) => {
    const token = auth.getToken();
    const response = await backoffice_service().deleteMaterial({
      token,
      id: event.currentTarget.firstChild.firstChild.getAttribute('data-id')
    });
    if (!response.error)
      setSnackbar({ status: true, code: "success", message: (<FormattedMessage id="GENERAL.FORM.SUCCESS.FILES.DELETED"></FormattedMessage>) });
    else
      setSnackbar({ status: true, code: "error", message: response.msj });
    return handleChangePageMaterials(null, lesson, 0);
  }

  let handleSaveFile = async () => {
    const token = auth.getToken();
    if (files.length <= 0) return setSnackbar({ status: true, code: "error", message: (<FormattedMessage id="GENERAL.FORM.ERROR.FILES.REQUIRED"></FormattedMessage>) });
    const newFiles = [...files]
    let index = 0;
    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== 2) {
        newFiles[index].status = 1
        setFiles([...newFiles])

        const form_data = new FormData();
        form_data.contentType = 'multipart/form-data';

        form_data.append("file", files[i].file);
        form_data.append("lesson_id", lesson);
        const { status } = await backoffice_service().uploadMaterial({ token, form_data });

        if (status === 201) {
          newFiles[index].status = 2
        } else {
          newFiles[index].status = 3
          setSnackbar({
            status: true,
            code: "error",
            message: (<FormattedMessage id="GENERAL.FORM.ERROR.FILES.SIZE"></FormattedMessage>)
          })
        }

        setFiles([...newFiles]);

        index++;
      }
      else
        index++
    }
    setSnackbar({ status: true, code: "success", message: (<FormattedMessage id="GENERAL.FORM.SUCCESS.FILES.UPLOADED"></FormattedMessage>) });
    setTimeout(() => handleChangePageMaterials(null, lesson, 0), 1000);
    setTimeout(() => setFiles([]), 2000)
  }


  let makeHeaderTable = (Component, classes, body) => (
    <aside className="mt-4">
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Typography variant="h5">
          <FormattedMessage id="DASHBOARD.CONTENT.MATERIALS.LIST.TABLE_LOADED.TITLE"></FormattedMessage>
        </Typography>
      </Grid>
      <TableContainer className={"mt-2"} component={Component}>
        <TableFile className={classes.table} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.thead}>#</TableCell>
              <TableCell className={classes.thead} align="left"><FormattedMessage id="DASHBOARD.CONTENT.MATERIALS.LIST.TABLE_LOADED.NAME"></FormattedMessage></TableCell>
              <TableCell className={classes.thead} align="center"><FormattedMessage id="DASHBOARD.CONTENT.MATERIALS.LIST.TABLE_LOADED.SIZE"></FormattedMessage></TableCell>
              <TableCell className={classes.thead} align="center"><FormattedMessage id="DASHBOARD.CONTENT.MATERIALS.LIST.TABLE_LOADED.STATE"></FormattedMessage></TableCell>
              <TableCell className={classes.thead} align="center"><FormattedMessage id="DASHBOARD.CONTENT.MATERIALS.LIST.TABLE_LOADED.OPTIONS"></FormattedMessage></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{body}</TableBody>
        </TableFile>
      </TableContainer>
    </aside>
  )

  let makeTable = (array) =>
    array.map((value, index) => (
      <TableRow key={index} >
        <TableCell>{index + 1}</TableCell>
        <TableCell align="left">{value.file.path}</TableCell>
        <TableCell align="center">{((value.file.size) / 1000000).toFixed(2)} Megabytes</TableCell>
        <TableCell align="center">
          {
            value.status === 0 ?
              <Schedule />
              : value.status === 1 ?
                <CircularProgress
                  size={24}
                  thickness={4} />
                : value.status === 2 ?
                  <CheckCircleOutline style={{ color: 'rgba(165, 220, 134, 1)' }} />
                  : <Error style={{ color: 'rgb(213, 0, 0)' }} />
          }
        </TableCell>
        <TableCell align="center">
          <IconButton onClick={() => handleRemoveFile(value, array)} size="small">
            <Delete fontSize="default" />
          </IconButton>
        </TableCell>
      </TableRow>
    ))

  const handleSaveLesson = async (event) => {
    event.preventDefault();
    let error = false;
    setFormData({ ...validator(formData) });
    Object.entries(formData).forEach(([key, value]) => { if (value.error) error = true; });
    if (error) return setSnackbar({ status: true, code: "error", message: (<FormattedMessage id="GENERAL.FORM.ERROR.ERRORS.TEXT"></FormattedMessage>) });
    const token = auth.getToken();
    const response = await backoffice_service().createLesson({
      data: {
        title: formData.title.data,
        is_last: formData.last_lesson.data,
        parent_id: formData.parent.data.unit.id === formData.unit.data.id ? formData.parent.data.id : null,
        unit_id: formData.unit.data.id
      }, token
    });
    if (response.error) return setSnackbar({ status: true, code: "error", message: response.msj });
    setFormData({ ...formInitData });
    updateParent();
    return handleChangePage(null, page);
  }

  let filesTable = makeTable(files);

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
          <Grid container style={{ textAlign: 'center' }}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <FormGroup>
                <FormControl component="fieldset">
                  <div className={`card card-custom card-stretch gutter-b`}>
                    <div className="card-header border-0 py-5">
                      <h3 className="card-title align-items-start flex-column">
                        <span className="card-label font-weight-bolder text-dark"><FormattedMessage id="DASHBOARD.CONTENT.MATERIALS.LIST.TITLE"></FormattedMessage></span>
                        <span className="text-muted mt-3 font-weight-bold font-size-sm">
                          <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.MATERIALS.LIST.SUBTITLE"></FormattedMessage></FormLabel>
                        </span>
                      </h3>
                    </div>
                    <div className="card-body pt-0 pb-3">
                      <div className="tab-content">
                        <section className={`${classes.fullWidth} mt-4`}>
                          <Dropzone className={'p-2 bg-primary'} maxFiles={5} multiple={true} accept={'.pdf, .mp4, .mp3'} onDrop={acceptedFiles => handleOnDropAccepted(acceptedFiles)} onDropRejected={() => handleOnDropRejected()}>
                            {({ getRootProps, getInputProps }) => (
                              <div {...getRootProps({ className: classes.dropzone })}>
                                <input {...getInputProps()} />
                                <p><FormattedMessage id="DASHBOARD.CONTENT.MATERIALS.LIST.DROPDOWN.FIRST_TEXT"></FormattedMessage></p>
                                <Publish className={"fill-upload-file"} />
                                <p><FormattedMessage id="DASHBOARD.CONTENT.MATERIALS.LIST.DROPDOWN.SECOND_TEXT"></FormattedMessage><b> pdf, mp4 y mp3</b></p>
                              </div>
                            )}
                          </Dropzone>
                        </section>
                        {
                          filesTable.length > 0 ?
                            makeHeaderTable(Paper, classes, filesTable)
                            : null
                        }
                        <Grid container className={"justify-content-center mt-5"}>
                          <Grid item xs={12} sm={6} md={6} lg={6}>
                            <section className={"text-center"}>
                              <Button
                                variant="contained"
                                size="large"
                                disableRipple
                                onClick={handleSaveFile}
                                className={`${classes.button} btn btn-primary btn-block`}
                                style={{ marginBottom: '2rem' }}>
                                <FormattedMessage id="GENERAL.FORM.ACTIONS.SAVE"></FormattedMessage>
                              </Button>
                            </section>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  </div>
                </FormControl>
              </FormGroup>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <div className={"mt-2"}>
                <Table numRows={2} title={<FormattedMessage id="DASHBOARD.CONTENT.MATERIALS.LIST.TABLE.TITLE"></FormattedMessage>} subtitle={''} className="card-stretch gutter-b" data={materials} current_page={pageMaterials} total={totalMaterials} onChildDelete={handleDeleteMaterial} onChildPaginationClick={handlePreChangePageMaterials}></Table>
                <p style={{ textAlign: 'right' }}>
                  <Button size={"large"} className={`btn btn-primary`} variant="contained" onClick={handleCloseModal}><FormattedMessage id="GENERAL.FORM.ACTIONS.CLOSE"></FormattedMessage></Button>
                </p>
              </div>
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
          <h2 className="mb-5"><FormattedMessage id="DASHBOARD.CONTENT.LESSONS.FIND.TITLE"></FormattedMessage></h2>

          <div className={classes.root}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <form onSubmit={findLessonByFilter} noValidate autoComplete="off">
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={10} md={10} lg={10}>
                      <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.LESSONS.FIND.NAME.LABEL"></FormattedMessage>} variant="filled" value={filterText} className="wd-full search-text-field" size="small" onChange={handleChangeFilterText} />
                    </Grid>
                    <Grid item xs={6} sm={2} md={2} lg={2}>
                      <Button type={"submit"} variant="contained" color="secondary" size="large" className="btn-secondary btn-block h-40">
                        <FormattedMessage id="GENERAL.FORM.ACTIONS.FIND"></FormattedMessage>
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
            <FCEHeader title={<FormattedMessage id="DASHBOARD.CONTENT.LESSONS.CREATE.TITLE"></FormattedMessage>} subtitle={<FormattedMessage id="DASHBOARD.CONTENT.LESSONS.CREATE.SUBTITLE"></FormattedMessage>}></FCEHeader>
            {/* Body */}
            <div className="card-body d-flex flex-column">
              <form noValidate autoComplete="off" onSubmit={handleSaveLesson}>
                <Grid container>
                  <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2">
                    <FormControl component="fieldset" className="wd-full">
                      <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.LESSONS.FORM.NAME.LABEL"></FormattedMessage></FormLabel>
                      <TextField label={<FormattedMessage id="DASHBOARD.CONTENT.LESSONS.FORM.NAME.PLACEHOLDER"></FormattedMessage>} variant="outlined" size="small" value={formData.title.data} className="form-text-field mt-2" error={formData.title.error} helperText={formData.title.msj} onChange={handleChangeTitle} />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                    <FormControl component="fieldset" className="wd-full">
                      <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.LESSONS.FORM.SELECT.LABEL"></FormattedMessage></FormLabel>
                      <Autocomplete
                        options={units}
                        getOptionLabel={(option) => option.name ? option.name : ""}
                        value={formData.unit.data}
                        className="mt-2"
                        size={'small'}
                        style={{ width: "100%" }}
                        onChange={handleChangeUnit}
                        renderInput={(params) => <TextField {...params} label={<FormattedMessage id="DASHBOARD.CONTENT.LESSONS.FORM.SELECT.PLACEHOLDER"></FormattedMessage>} variant="outlined" style={{ height: "40px" }} error={formData.unit.error} helperText={formData.unit.msj} />}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                    <FormControl component="fieldset" className="wd-full">
                      <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.LESSONS.FORM.SELECT.LAST_LESSON.LABEL"></FormattedMessage></FormLabel>
                      <TextField label="" variant="outlined" size="small" value={formData.parent.data ? formData.parent.data.title : ''} className="form-text-field mt-2" disabled />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                    <FormControl component="fieldset" className="wd-full">
                      <FormLabel component="legend"><FormattedMessage id="DASHBOARD.CONTENT.LESSONS.FORM.SELECT.LAST_LESSON.NAME"></FormattedMessage></FormLabel>
                      <RadioGroup row value={formData.last_lesson.data} onChange={handleChangeLastLesson}>
                        <FormControlLabel value={true} control={<Radio color="default" />} label={<FormattedMessage id="GENERAL.FORM.OPTIONS.YES"></FormattedMessage>} />
                        <FormControlLabel value={false} control={<Radio color="default" />} label={<FormattedMessage id="GENERAL.FORM.OPTIONS.NO"></FormattedMessage>} />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                    <Button variant="contained" className="btn-primary btn-block h-35" type={'submit'}>
                      <FormattedMessage id="GENERAL.FORM.ACTIONS.SAVE"></FormattedMessage>
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={8} md={8} lg={8}>
          <Table title={<FormattedMessage id="DASHBOARD.CONTENT.LESSONS.LIST.TITLE"></FormattedMessage>} subtitle={<FormattedMessage id="DASHBOARD.CONTENT.LESSONS.LIST.SUBTITLE"></FormattedMessage>} className="card-stretch gutter-b" data={lessons} current_page={page} total={total} onChildEdit={handleEdit} onChildFile={handleUploadMaterial} onChildCreate={null} onChildPaginationClick={handleChangePage}></Table>
        </Grid>
      </Grid>
    </>
  );
};
