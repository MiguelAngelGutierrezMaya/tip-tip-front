/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/img-redundant-alt */
import React from "react";

/**
 * Components
 */
import {
    Grid,
    Chip,
    TablePagination,
    IconButton
} from '@material-ui/core';

export function Table({ numRows, className, data, current_page, total, onChildEdit, onChildCreate, onChildDelete, onChildPaginationClick, onChildFile, title, subtitle }) {


    /**
     * handleChangePage
     * @param {*} event 
     * @param {*} newPage 
     */
    const handleChangePage = (event, newPage) => {
        onChildPaginationClick(event, newPage);
    };

    /**
     * HandleEdit
     * @param {*} event 
     */
    const handleEdit = (event) => onChildEdit(event);

    /**
     * HandleFile
     * @param {*} event 
     */
    const handleFile = (event) => onChildFile(event);

    /**
     * HandleDelete
     * @param {*} event 
     */
    const handleDelete = (event) => onChildDelete(event);

    return (
        <div className={`card card-custom ${className}`}>
            {
                title ? (
                    <div className="card-header border-0 py-5">
                        <h3 className="card-title align-items-start flex-column">
                            <span className="card-label font-weight-bolder text-dark">{title}</span>
                            <span className="text-muted mt-3 font-weight-bold font-size-sm">{subtitle}</span>
                        </h3>
                        <div className="card-toolbar">
                            {
                                onChildCreate != null ?
                                    <a href="#" className="btn btn-danger font-weight-bolder font-size-sm">Create</a> : (<></>)
                            }
                        </div>
                    </div>
                ) : (<></>)
            }
            <div className="card-body pt-0 pb-3">
                <div className="tab-content">
                    <div className="table-responsive">
                        <table className="table table-head-custom table-head-bg table-borderless table-vertical-center">
                            <thead>
                                <tr className="text-left text-uppercase text-center">
                                    {
                                        data.headers.map((el, i) => {
                                            return (
                                                <th key={`header-${i}`}>{el.name}</th>
                                            )
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.body.map((el, i) => {
                                        return (
                                            <tr key={`body-${i}`} className="text-center">
                                                {
                                                    el.content.map((el, j) => {
                                                        switch (el.action) {
                                                            case "chip":
                                                                return (
                                                                    <td key={`body-${i}-content-${j}`}>
                                                                        <Chip
                                                                            label={el.value}
                                                                            className={`chip-${el.color}`}
                                                                        />
                                                                    </td>
                                                                );
                                                            case "href":
                                                                return (
                                                                    <td key={`body-${i}-content-${j}`}>
                                                                        <a href={el.value} target={'blank'}>{el.text}</a>
                                                                    </td>
                                                                );
                                                            case "edit":
                                                                return (
                                                                    <td key={`body-${i}-content-${j}`}>
                                                                        <IconButton color="default" aria-label="Edit" component="span" onClick={handleEdit}>
                                                                            <i className="flaticon-edit" data-id={el.value}></i>
                                                                        </IconButton>
                                                                    </td>
                                                                );
                                                            case "file":
                                                                return (
                                                                    <td key={`body-${i}-content-${j}`}>
                                                                        <IconButton color="default" aria-label="File" component="span" onClick={handleFile}>
                                                                            <i className="flaticon-file-2" data-id={el.value}></i>
                                                                        </IconButton>
                                                                    </td>
                                                                );
                                                            case "edit,file":
                                                                return (
                                                                    <td key={`body-${i}-content-${j}`}>
                                                                        <Grid container>
                                                                            <Grid item xs={12} sm={6} md={6} lg={6}>
                                                                                <IconButton color="default" aria-label="Edit" component="span" onClick={handleEdit}>
                                                                                    <i className="flaticon-edit" data-id={el.value}></i>
                                                                                </IconButton>
                                                                            </Grid>
                                                                            <Grid item xs={12} sm={6} md={6} lg={6}>
                                                                                <IconButton color="default" aria-label="File" component="span" onClick={handleFile}>
                                                                                    <i className="flaticon-file-2" data-id={el.value}></i>
                                                                                </IconButton>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </td>
                                                                );
                                                            case "state":
                                                                return el.component(`body-${i}-content-${j}`, null);
                                                            case "delete":
                                                                return (
                                                                    <td key={`body-${i}-content-${j}`}>
                                                                        <IconButton color="default" aria-label="Edit" component="span" onClick={handleDelete}>
                                                                            <i className="flaticon2-trash" data-id={el.value}></i>
                                                                        </IconButton>
                                                                    </td>
                                                                );
                                                            default:
                                                                return (
                                                                    <td key={`body-${i}-content-${j}`}>
                                                                        {el.value}
                                                                    </td>
                                                                )
                                                        }
                                                    })
                                                }
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <TablePagination
                    component="div"
                    count={total}
                    page={current_page}
                    onChangePage={handleChangePage}
                    rowsPerPage={numRows || Number(process.env.REACT_APP_PAGE_SIZE)}
                    rowsPerPageOptions={numRows ? [numRows] : [Number(process.env.REACT_APP_PAGE_SIZE)]}
                />
            </div>
        </div >
    );
}
