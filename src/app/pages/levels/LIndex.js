import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

/**
 * Utils
 */
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

/**
 * Components
 */
import { Table, FCEHeader } from './../../components';

/**
 * Services
 */
import routes_api from "./../../services/http/requests/routes-api";
import auth from './../../services/auth';

import {
  Grid,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  IconButton
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  table: {
    minWidth: 650,
  },
}));

export const LIndex = () => {

  const classes = useStyles();
  const history = useHistory();
  const permisision = auth.getPermission('Materiales', 'Niveles');
  if (!permisision) history.push(routes_api.frontend_tip_top().components.auth.home);

  /**
   * States
   */
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(100);
  const [value, setValue] = useState(false);
  const [levels, setLevels] = useState({

    headers: [
      {
        name: 'Código'
      },
      {
        name: 'Nombre'
      },
      {
        name: 'Nivel anterior'
      },
      {
        name: 'Último'
      },
      {
        name: 'Acciones'
      }
    ],
    body: [
      {
        content: [
          {
            name: 'id',
            value: 1,
            action: null
          },
          {
            name: 'name',
            value: "Topic word 1",
            action: null
          },
          {
            name: 'parent',
            value: null,
            action: null
          },
          {
            name: 'is_last',
            value: false,
            action: null
          },
          {
            action: 'edit',
            value: 1
          }
        ]
      },
      {
        content: [
          {
            name: 'id',
            value: 2,
            action: null
          },
          {
            name: 'name',
            value: "Topic word 2",
            action: null
          },
          {
            name: 'parent',
            value: 'Topic word 1',
            action: null
          },
          {
            name: 'is_last',
            value: false,
            action: null
          },
          {
            action: 'edit',
            value: 2
          }
        ]
      },
      {
        content: [
          {
            name: 'id',
            value: 3,
            action: null
          },
          {
            name: 'name',
            value: "Topic word 3",
            action: null
          },
          {
            name: 'parent',
            value: 'Topic word 2',
            action: null
          },
          {
            name: 'is_last',
            value: false,
            action: null
          },
          {
            action: 'edit',
            value: 3
          }
        ]
      },
      {
        content: [
          {
            name: 'id',
            value: 4,
            action: null
          },
          {
            name: 'name',
            value: "Topic word 3",
            action: null
          },
          {
            name: 'parent',
            value: 'Topic word 1',
            action: null
          },
          {
            name: 'is_last',
            value: true,
            action: 'state',
            component: (key, handleEvent) => (
              <td key={key}>
                <IconButton color="default" aria-label="Edit" component="span" onClick={() => handleEvent}>
                  <i className="flaticon-medal text-purple"></i>
                </IconButton>
              </td>
            )
          },
          {
            action: 'edit',
            value: 4
          }
        ]
      },
    ]
  });

  /**
   * Handlers
   * @param {*} event 
   * @param {*} newPage 
   */
  const handleChangePage = (event, newPage) => {
    console.log(newPage);
    setPage(newPage);
  };

  const handleChange = (event) => {
    const value = event.target.value === 'true';
    setValue(value);
  };

  const handleEdit = (event) => {
    console.log(event.target.getAttribute('data-id'));
  }

  return (
    <>
      <div
        role="alert"
        className={clsx(
          "alert alert-custom alert-purple alert-shadow gutter-b",
        )}
      >
        <div className="alert-text p-5">
          <h2 className="mb-5">Búsqueda de niveles</h2>

          <div className={classes.root}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <form noValidate autoComplete="off">
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={10} md={10} lg={10}>
                      <TextField label="Nombre" variant="filled" className="wd-full search-text-field" size="small" />
                    </Grid>
                    <Grid item xs={6} sm={2} md={2} lg={2}>
                      <Button variant="contained" color="secondary" size="large" className="btn-secondary btn-block h-40">
                        Buscar
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
            <FCEHeader title={'Crear nivel'} subtitle={'Diligenciar el formulario'}></FCEHeader>
            {/* Body */}
            <div className="card-body d-flex flex-column">
              <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12} className="pb-2">
                  <FormControl component="fieldset" className="wd-full">
                    <FormLabel component="legend">Nombre</FormLabel>
                    <TextField label="Nombre" variant="outlined" size="small" className="form-text-field mt-2" />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                  <FormControl component="fieldset" className="wd-full">
                    <FormLabel component="legend">Lección anterior</FormLabel>
                    <TextField label="Nombre" variant="outlined" size="small" className="form-text-field mt-2" disabled />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                  <FormControl component="fieldset" className="wd-full">
                    <FormLabel component="legend">Ultimo nivel?</FormLabel>
                    <RadioGroup row aria-label="gender" value={value} onChange={handleChange}>
                      <FormControlLabel value={true} control={<Radio color="default" />} label="Si" />
                      <FormControlLabel value={false} control={<Radio color="default" />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} className="pt-2 pb-2">
                  <Button variant="contained" className="btn-primary btn-block h-35">
                    Guardar
                  </Button>
                </Grid>
              </Grid>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={8} md={8} lg={8}>
          <Table title={'Listado de niveles'} subtitle={'Información básica'} className="card-stretch gutter-b" data={levels} current_page={page} total={total} onChildEdit={handleEdit} onChildCreate={null} onChildPaginationClick={handleChangePage}></Table>
        </Grid>
      </Grid>
    </>
  );
};
