import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import TextField from "@material-ui/core/TextField";
import Paper from '@material-ui/core/Paper';
import {ButtonGroup, MenuItem} from '@material-ui/core';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import RemoveIcon from '@material-ui/icons/Remove';
import Modal from '@material-ui/core/Modal';
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import convertDate from "../../components/ConvertDate";
import getPosition from '../../components/GetPosition';
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles(theme => ({
  button: {
    marginBottom: 20
  },
  submit: {
    marginTop: 20
  },
  table: {
    minWidth: 650,
  },
  hideAlert: {
    display: 'none'
  },
  showAlert: {
    display: 'flex'
  },
  paper: {
    position: 'absolute',
    maxWidth: 500,
    top: 70,
    left: `30%`,
    //transform: `translate(-${top}%, -${left}%)`,
    backgroundColor: theme.palette.background.paper,
    //border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#777777',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default function CandidatesPage() {
  const classes = useStyles();
  const [candList, setCandList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [candId, setId] = useState('');
  const [leads, setLeads] = useState([]);
  const [project, setProject] = useState([]);
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: '',
    supervisor: '',
    salary: 2000,
  });
  const [alert, setAlert] = useState({
    show: false,
    severity: 'success',
    message: ''
  });
  
  useEffect(() => {
    axios.get('http://localhost:5000/cand/get')
      .then(res => {
        setCandList(res.data)
      })
  }, [candList]);
  
  const submitHandler = async () => {
    const data = {candId, ...form}
    axios.post('http://localhost:5000/cand/createuser', data)
      .then(resp => {
        setAlert({
          show: true,
          severity: 'success',
          message: resp.data.message
        })
        //setOpenModal(false)
      })
    //console.log(data)
  }
  
  const buttonDetailsHandler = (id) => {
    window.location = `/candidates/${id}`
  }
  
  const buttonAddEmplHandler = (id, project) => {
    setId(id);
    axios.get(`http://localhost:5000/employees/leads/${project}`)
      .then(res => {
        setLeads(res.data)
      })
    axios.get(`http://localhost:5000/project/get/${project}`)
      .then(res => {
        setProject(res.data)
      })
    setOpenModal(true)
  }
  
  const buttonDeleteHandler = async (id) => {
    await axios.delete(`http://localhost:5000/cand/delete/${id}`)
      .then(res => {
        let newList = candList.filter(item => {
          if(item._id !== id) return item
        })
        setCandList(newList)
      });
  }
  
  const changeHandler = event => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }
  
  function getSalary(project, position) {
  
  }
  
  const headers = ["Ім'я", "Прізвище", "Позиція", "Проєкт", "Дата співбесіди", "Статус", "Дії"]
  const roles = ['admin', 'HR', 'employee', 'teamLead', 'manager']
  
  return (
    <div>
      <h1>Кандидати</h1>
      <Button className={classes.button} variant="contained"
              href="candidates/new"
      >Додати</Button>
      
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              {headers.map(h =>
                <StyledTableCell key={h}>{h}</StyledTableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {candList.map((row) => (
              <StyledTableRow key={row._id}>
                <StyledTableCell component="th" scope="row">
                  {row.firstName}
                </StyledTableCell>
                <StyledTableCell>{row.lastName}</StyledTableCell>
                <StyledTableCell>{getPosition(row.seniority, row.position)}</StyledTableCell>
                <StyledTableCell>{row.project.name ? row.project.name : null}</StyledTableCell>
                <StyledTableCell>{convertDate(row.interviewDate, true)}</StyledTableCell>
                <StyledTableCell><i>{row.status}</i></StyledTableCell>
                <StyledTableCell>
                  <ButtonGroup size="small" aria-label="small outlined button group">
                    <Button onClick={() => buttonDetailsHandler(row._id)}>
                      <ListAltIcon />
                    </Button>
                    <Button disabled={row.status !== 'Пропозиція'} onClick={() => buttonAddEmplHandler(row._id, row.project._id)}>
                      <PersonAddIcon />
                    </Button>
                    <Button onClick={() => buttonDeleteHandler(row._id)}>
                      <RemoveIcon />
                    </Button>
                    
                    <Modal open={openModal} onClose={() => setOpenModal(false)}>
                      <div className={classes.paper}>
                        <h1>Введіть додаткові дані працівника</h1>
                        <form noValidate>
                          <Grid container spacing={3}>
                            <Grid item xs={6}>
                              <TextField
                                variant="outlined"
                                size='small'
                                fullWidth
                                label="Ім'я користувача"
                                name="username"
                                onChange={changeHandler}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                variant="outlined"
                                size='small'
                                fullWidth
                                label="Пароль"
                                name="password"
                                type="password"
                                onChange={changeHandler}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                select
                                defaultValue=''
                                variant="outlined"
                                size='small'
                                fullWidth
                                label="Керівник"
                                name="supervisor"
                                onChange={changeHandler}
                              >
                                {leads.map(item =>
                                  <MenuItem
                                    key={item._id}
                                    value={item.username}
                                  >{item.firstName} {item.lastName} ({getPosition(item.seniority, item.position)})</MenuItem>
                                )}
                              </TextField>
                            </Grid>
                            <Grid item xs={7}>
                              <TextField
                                select
                                defaultValue=''
                                variant="outlined"
                                size='small'
                                fullWidth
                                label="Роль"
                                name="role"
                                onChange={changeHandler}
                              >
                                {roles.map(item =>
                                  <MenuItem key={item} value={item}>{item}</MenuItem>
                                )}
                              </TextField>
                            </Grid>
                            <Grid item xs={5}>
                              <TextField
                                variant="outlined"
                                size='small'
                                fullWidth
                                label="Зарплата"
                                name="salary"
                                defaultValue={2000}
                                onChange={changeHandler}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Alert
                                severity={alert.severity}
                                className={alert.show ? classes.showAlert : classes.hideAlert}
                              >
                                {alert.message}
                              </Alert>
                            </Grid>
                          </Grid>
                          <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={submitHandler}
                          >
                            Готово
                          </Button>
                        </form>
                      </div>
                    </Modal>
                    
                  </ButtonGroup>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}