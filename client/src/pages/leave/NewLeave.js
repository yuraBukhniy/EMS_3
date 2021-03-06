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
import Alert from "@material-ui/lab/Alert";

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
    width: '100%',
    marginTop: theme.spacing(3),
  },
  formControl: {
    width: '100%'
  },
  select: {
    maxWidth: 400,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  cancel: {
    margin: theme.spacing(3, 0, 2),
    marginLeft: 10
  },
  hideAlert: {
    display: 'none'
  },
  showAlert: {
    display: 'flex'
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
  const [leavesAvailable, setLeavesAvailable] = useState({});
  const [alert, setAlert] = useState({
    show: false,
    severity: 'success',
    message: ''
  })
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
        setAlert({
          show: true,
          severity: resp.data.error ? 'error' : 'success',
          message: resp.data.message
        })
      })
      .catch(err => {
        setAlert({
          show: true,
          severity: 'error',
          message: '??????????????'
        })
      })
  };
  
  const cancelHandler = () => {
    window.location = '/leave';
  }
  
  const types = ['????????????????????', '????????????????????????', '????????????????????']
  
  return (
    <Container component="main" maxWidth="sm">
      <div className={classes.paper}>
        <h1>???????????????? ??????????????????</h1>
        <form className={classes.form} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              ???????????????????? ??????????????????
              <Typography>
                {leavesAvailable.paid ? leavesAvailable.paid : null} ????????
              </Typography>
            </Grid>
            <Grid item xs={4}>
              ???????????????????????? ??????????????????
              <Typography>
                {leavesAvailable.unpaid ? leavesAvailable.unpaid : null} ????????
              </Typography>
            </Grid>
            <Grid item xs={4}>
              ??????????????????
              <Typography>
                {leavesAvailable.illness ? leavesAvailable.illness : null} ????????
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                multiline
                id="description"
                label="????????"
                name="description"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type='date'
                variant="outlined"
                size='small'
                fullWidth
                id="startDate"
                label="???????? ??????????????"
                name="startDate"
                onChange={changeHandler}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type='date'
                variant="outlined"
                size='small'
                fullWidth
                id="endDate"
                label="???????? ????????????????????"
                name="endDate"
                onChange={changeHandler}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                size='small'
                fullWidth
                id="type"
                label="??????"
                name="type"
                className={classes.select}
                onChange={changeHandler}
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
            ????????????????
          </Button>
          <Button
            type="button"
            variant="contained"
            color="secondary"
            className={classes.cancel}
            onClick={cancelHandler}
          >
            ??????????
          </Button>
          <Grid item xs={12}>
            <Alert
              severity={alert.severity}
              className={alert.show ? classes.showAlert : classes.hideAlert}
            >
              {alert.message}
            </Alert>
          </Grid>
        </form>
      </div>
    </Container>
  );
}