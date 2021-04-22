import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {Checkbox, FormControl, Input, ListItemText} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";

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
    maxWidth: 400,
    //marginBottom: 20
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  cancel: {
    margin: theme.spacing(3, 0, 2),
    marginLeft: 10
  }
}));



export default function NewLeave() {
  const userId = JSON.parse(localStorage.getItem('user')).userId;
  const [leaveData, setLeaveData] = useState({
    description: '',
    author: userId,
    type: '',
    startDate: '',
    endDate: '',
  })
  const [leavesAvailable, setLeavesAvailable] = useState({})
  const classes = useStyles();
  
  useEffect(() => {
    axios.get(`http://localhost:5000/leave/balance/${userId}`)
      .then(res => {
        setLeavesAvailable(res.data)
      })
  }, []);
  
  const changeHandler = event => {
    setLeaveData({
      ...leaveData,
      [event.target.name]: event.target.value
    })
  }
  
  const buttonHandler = async () => {
    axios.post('http://localhost:5000/leave/create', {leaveData, leavesAvailable})
      .then(resp => {
        console.log(resp.data)
      })
    //window.location = '/tasks';
    //console.log(leaveData)
  };
  
  const cancelHandler = () => {
    window.location = '/leave';
  }
  
  const types = ['оплачувана', 'неоплачувана', 'лікарняний']
  
  return (
    <Container component="main" maxWidth="sm">
      <div className={classes.paper}>
        <h1>Оформити відпустку</h1>
        <form className={classes.form} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              Оплачувана відпустка
              <Typography>
                {leavesAvailable.paid ? leavesAvailable.paid : null} днів
              </Typography>
            </Grid>
            <Grid item xs={4}>
              Неоплачувана відпустка
              <Typography>
                {leavesAvailable.unpaid ? leavesAvailable.unpaid : null} днів
              </Typography>
            </Grid>
            <Grid item xs={4}>
              Лікарняні
              <Typography>
                {leavesAvailable.illness ? leavesAvailable.illness : null} днів
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                multiline
                id="description"
                label="Опис"
                name="description"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type='datetime-local'
                variant="outlined"
                size='small'
                fullWidth
                id="startDate"
                label="Дата початку"
                name="startDate"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type='datetime-local'
                variant="outlined"
                size='small'
                fullWidth
                id="endDate"
                label="Дата закінчення"
                name="endDate"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                size='small'
                fullWidth
                id="type"
                label="Тип"
                name="type"
                className={classes.select}
                onChange={changeHandler}
                //onChange={event => changeStatusHandler(event.target.value)}
              >
                {types.map(type =>
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                )}
              </TextField>
            </Grid>
          </Grid>
          <Button
            type="button"
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={buttonHandler}
          >
            Створити
          </Button>
          <Button
            type="button"
            variant="contained"
            color="secondary"
            className={classes.cancel}
            onClick={cancelHandler}
          >
            Назад
          </Button>
        </form>
      </div>
    </Container>
  );
}