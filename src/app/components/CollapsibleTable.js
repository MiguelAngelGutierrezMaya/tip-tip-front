import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

function Row({ row, id, onChildEdit }) {
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    /**
     * HandleEdit
     * @param {*} event 
     */
    const handleEdit = (event) => onChildEdit(event);

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                {
                    row.content.map((el, j) => {
                        switch (el.action) {
                            case "edit":
                                return (
                                    <TableCell component="th" scope="row" key={`collapsible-body-${id}-content-${j}`}>
                                        <IconButton color="default" aria-label="Edit" component="span" onClick={handleEdit}>
                                            <i className="flaticon-edit" data-id={el.value}></i>
                                        </IconButton>
                                    </TableCell>
                                );
                                break;
                            default:
                                return (
                                    <TableCell component="th" scope="row" key={`collapsible-body-${id}-content-${j}`}>
                                        {el.value}
                                    </TableCell>
                                )
                        }
                    })
                }
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={parseInt(row.content.length) + 1}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            {
                                row.template
                            }
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export function CollapsibleTable({ className, data, onChildEdit, onChildCreate, onChildDelete, onChildPaginationClick, onChildFile, title, subtitle }) {

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
                        <TableContainer component={Paper}>
                            <Table aria-label="table table-head-custom table-head-bg table-borderless table-vertical-center collapsible table">
                                <TableHead>
                                    <TableRow className={"text-uppercase text-center"}>
                                        <TableCell />
                                        {
                                            data.headers.map((el, i) => {
                                                return (
                                                    <TableCell key={`collapsible-header-${i}`}>{el.name}</TableCell>
                                                )
                                            })
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.body.map((row, i) => (
                                        <Row key={`collapsible-body-${i}`} id={i} row={row} onChildEdit={handleEdit} />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}