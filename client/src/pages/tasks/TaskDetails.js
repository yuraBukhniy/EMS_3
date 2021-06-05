import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {Checkbox, FormControl, Input, ListItemText} from "@material-ui/core";
import convertDate from '../../components/ConvertDate';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles({
  marginDown: {
    marginBottom: 20,
  },
  marginUp: {
    marginTop: 20,
  },
  edit: {
    maxWidth: '40%'
  },
  status: {
    maxWidth: 300
  },
  formControl: {
    marginTop: 10,
    width: 300
  },
  button: {
    marginTop: 20,
  },
  row: {
    maxWidth: 80
  },
  loader: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    color: '#888888'
  }
});


export default function TaskDetails({role}) {
  const classes = useStyles();
  const username = JSON.parse(localStorage.getItem('user')).username;
  const [task, setTask] = useState({});
  const [status, setStatus] = useState('');
  const [employees, setEmployees] = useState([]);
  const [assignedTo, setAssigned] = useState([]);
  const [overtime, setOvertime] = useState({
    employee: username,
    date: '',
    hours: 0
  })
  const taskId = useParams().id;
  
  useEffect(() => {
    axios.get(`http://localhost:5000/task/${taskId}`)
      .then(res => {
        setTask(res.data)
      })
  }, [task]);
  
  useEffect(() => {
    axios.get(`http://localhost:5000/employees/team/${username}`)
      .then(res => {
        setEmployees(res.data)
      })
  }, []);
  
  function changeStatusHandler(value) {
    setStatus(value)
  }
  
  function emplListChangeHandler(event) {
    setAssigned(event.target.value)
  }
  
  function changeOvertimeHandler(event) {
    let value = event.target.value;
    if(event.target.name === 'hours') value = +value;
    setOvertime({
      ...overtime,
      [event.target.name]: value
    })
  }
  
  function buttonHandler() {
    axios.patch(`http://localhost:5000/task/edit/${taskId}`, {status, assignedTo})
      .then(resp => {
        console.log(resp.data)
      })
  }
  
  function buttonOvertimeHandler() {
    axios.put(`http://localhost:5000/task/overtime/${taskId}`, overtime)
      .then(resp => {
        console.log(resp.data)
      })
  }
  
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  
  const statuses = role === 'employee' ?
    ['У черзі', 'В процесі', "Виконано"]
    : ['В процесі', "Закрито"]
  
  function isAssigned(assigned, username) {
    let result = false;
    for(let item of assigned) {
      if(item.username === username) result = true;
    }
    return result;
  }
  
  return Object.keys(task).length ? (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={8}>
        <Typography className={classes.marginDown} variant='h4'>
          {task.title}
        </Typography>
        <Typography color="textSecondary">
          Дата початку: {convertDate(task.startDate)}
        </Typography>
        <Typography color="textSecondary">
          Планова дата закінчення: {convertDate(task.deadline)}
        </Typography>
        <Typography color="textSecondary">
          Статус: {task.status}
        </Typography>
        {task.endDate ? (
          <Typography color="textSecondary">
            Виконано: {convertDate(task.endDate)}
          </Typography>
        ) : null}
        <Typography className={classes.marginDown} color="textSecondary">
          Виконавці: {task.assignedTo ? task.assignedTo.map(user => user.firstName + " " + user.lastName).join(', ') : null}
        </Typography>
        <Typography className={classes.marginUp} variant='h5'>
          Опис
        </Typography>
        <Divider />
        <Typography variant='h6'>
          {task.description}
        </Typography>
      </Grid>
  
      <Grid item xs={12} md={6}>
        <Typography className={classes.marginUp} variant='h5'>
          Редагувати завдання
        </Typography>
        <TextField
          select
          size='small'
          fullWidth
          id="status"
          label="Статус"
          name="status"
          className={classes.status}
          onChange={event => changeStatusHandler(event.target.value)}
        >
          {statuses.map(status =>
            <MenuItem key={status} value={status}>{status}</MenuItem>
          )}
        </TextField>
  
        {role !== 'employee' ?
          <Grid item xs={12}>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-mutiple-checkbox-label">Працівники</InputLabel>
              <Select
                labelId="demo-mutiple-checkbox-label"
                id="demo-mutiple-checkbox"
                multiple
                value={assignedTo}
                onChange={emplListChangeHandler}
                input={<Input/>}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
              >
                {employees.map((employee) => (
                  <MenuItem key={employee.username} value={employee.username}>
                    <Checkbox checked={assignedTo.indexOf(employee.username) > -1}/>
                    <ListItemText primary={employee.firstName + ' ' + employee.lastName}/>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>: null}
  
        <Grid item xs={12}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={buttonHandler}
          >
            Зберегти
          </Button>
        </Grid>
      </Grid>
  
      {task.assignedTo ? isAssigned(task.assignedTo, username) ?
        <Grid item xs={12} md={6}>
          <Grid item xs={12}>
            <Typography className={classes.marginUp} variant='h5'>
              Овертайми
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <TextField
              type='date'
              size='small'
              fullWidth
              id="date"
              label="Дата"
              name="date"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={event => changeOvertimeHandler(event)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              type='number'
              size='small'
              fullWidth
              id="hours"
              label="Години"
              name="hours"
              onChange={event => changeOvertimeHandler(event)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={buttonOvertimeHandler}
            >
              Зберегти
            </Button>
          </Grid>
        </Grid> : null : null}
        
      {task.overtime ? task.overtime.length ?
        <Grid item xs={12}>
          <Typography className={classes.marginUp} variant='h5'>
            Дані про овертайми
          </Typography>
          
          {task.assignedTo.map(name =>
            task.overtime.filter(item => item.employee === name.username && item.hours).length ?
              <div key={task.assignedTo.indexOf(name)}>
                <Typography className={classes.marginUp} variant='h6'>
                  {name.firstName + ' ' + name.lastName}
                </Typography>
                <TableContainer component={Paper} style={{width: 120 * (task.overtime.filter(item => item.employee === name.username).length + 1)}}>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Дата</TableCell>
                        {task.overtime.map(item =>
                          item.employee === name.username ?
                            <TableCell align="center" key={task.overtime.indexOf(item)}>
                              {item.date}
                            </TableCell> : null
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Години</TableCell>
                        {task.overtime.map(item =>
                          item.employee === name.username ?
                            <TableCell align="center" key={task.overtime.indexOf(item)}>
                              {item.hours}
                            </TableCell> : null
                        )}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div> : null
          )}
        </Grid> : null : null}

    </Grid>
    
  ) : <CircularProgress size={100} className={classes.loader} />
}