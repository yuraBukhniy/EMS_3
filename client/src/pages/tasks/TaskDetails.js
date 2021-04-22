import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
// import Container from "@material-ui/core/Container";
// import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {Checkbox, FormControl, Input, ListItemText} from "@material-ui/core";
import convertDate from '../../components/ConvertDate';

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
    //maxWidth: '40%'
    width: 500
  },
  formControl: {
    marginTop: 10,
    width: 500
  },
  button: {
    marginTop: 20,
  }
});


export default function TaskDetails({role}) {
  const classes = useStyles();
  const [task, setTask] = useState({});
  const [status, setStatus] = useState('');
  const [employees, setEmployees] = useState([]);
  const [assignedTo, setAssigned] = useState([]);
  const leadUsername = JSON.parse(localStorage.getItem('user')).username;
  const taskId = useParams().id;
  
  useEffect(() => {
    axios.get(`http://localhost:5000/task/${taskId}`)
      .then(res => {
        setTask(res.data)
      })
  }, []);
  
  useEffect(() => {
    axios.get(`http://localhost:5000/employees/team/${leadUsername}`)
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
  
  function buttonHandler() {
    axios.patch(`http://localhost:5000/task/edit/${taskId}`, {status, assignedTo})
      .then(resp => {
        console.log(resp.data)
      })
    //window.location = '/tasks';
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
  
  return (
    <>
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
        Виконавці: {task.assignedTo ? task.assignedTo.join(', ') : null}
      </Typography>
      <Typography className={classes.marginUp} variant='h5'>
        Опис
      </Typography>
      <Divider />
      <Typography variant='h6'>
        {task.description}
      </Typography>
  
      {/*<Container component="main" maxWidth="md">*/}
      {/*  <Grid container spacing={3}>*/}
      {/*    <Grid item xs={4}>*/}
      <div className={classes.edit}>
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
              {/*<MenuItem value={'У черзі'}>У черзі</MenuItem>*/}
              {/*<MenuItem value={'В процесі'}>В процесі</MenuItem>*/}
              {/*<MenuItem value={'Виконано'}>Виконано</MenuItem>*/}
              {/*<MenuItem value={'Закрито'}>Закрито</MenuItem>*/}
            </TextField>
          {/*</Grid>*/}
  
        {role !== 'employee' ? <FormControl className={classes.formControl}>
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
        </FormControl> : null}
        
          <Button
            type="button"
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={buttonHandler}
          >
            Зберегти
          </Button>
        </div>
      {/*  </Grid>*/}
      {/*</Container>*/}
    </>
  )
}