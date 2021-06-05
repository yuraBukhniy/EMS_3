import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from "@material-ui/core/Select";
import axios from "axios";
import {Checkbox, FormControl, Input, ListItemText} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  formControl: {
    width: '100%'
  },
  select: {
    height: 40,
    width: 170
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  cancel: {
    margin: theme.spacing(3, 0, 2),
    marginLeft: 10
  }
}));

export default function NewTask() {
  const leadUsername = JSON.parse(localStorage.getItem('user')).username;
  const project = JSON.parse(localStorage.getItem('user')).project;
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    author: leadUsername,
    project: project,
    deadline: ''
  });
  
  const [employees, setEmployees] = useState([]);
  const [assigned, setAssigned] = useState([]);
  
  useEffect(() => {
    axios.get(`http://localhost:5000/employees/team/${leadUsername}`)
      .then(res => {
        setEmployees(res.data)
      })
  }, []);
  
  const changeHandler = event => {
    setTaskData({
      ...taskData,
      [event.target.name]: event.target.value
    })
  }
  
  const buttonHandler = async () => {
    axios.post('http://localhost:5000/task/create', {taskData, assigned})
      .then(resp => {
        window.location = '/tasks';
      })
    //console.log({taskData, assigned})
  };
  
  const cancelHandler = () => {
    window.location = '/tasks';
  }
  
  const emplListChangeHandler = event => {
    setAssigned(event.target.value)
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
  
  const classes = useStyles();
  
  return (
    <Container component="main" maxWidth="sm">
      <div className={classes.paper}>
        <h1>Додати завдання</h1>
        <form className={classes.form} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                id="title"
                label="Назва"
                name="title"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                multiline
                id="description"
                label="Опис завдання"
                name="description"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='body2'>
                Кінцевий термін
              </Typography>
              <TextField
                type='date'
                inputProps={{min: (new Date(Date.now())).toLocaleString()}}
                variant="outlined"
                size='small'
                fullWidth
                id="deadline"
                name="deadline"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6'>
                Присвойте завдання працівникам
              </Typography>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-mutiple-checkbox-label">Працівники</InputLabel>
                <Select
                  labelId="demo-mutiple-checkbox-label"
                  id="demo-mutiple-checkbox"
                  multiple
                  value={assigned}
                  onChange={emplListChangeHandler}
                  input={<Input />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {employees.map((employee) => (
                    <MenuItem key={employee.username} value={employee.username}>
                      <Checkbox checked={assigned.indexOf(employee.username) > -1} />
                      <ListItemText primary={employee.firstName + " " + employee.lastName} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
          </Grid>
          <Button
            type="button"
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={buttonHandler}
          >
            Зберегти
          </Button>
          <Button
            type="button"
            variant="contained"
            color="secondary"
            className={classes.cancel}
            onClick={cancelHandler}
          >
            Скасувати
          </Button>
        </form>
      </div>
    </Container>
  );
}