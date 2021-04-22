import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import Modal from '@material-ui/core/Modal';
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import {Alert} from "@material-ui/lab";

const useStyles = makeStyles(theme => ({
  button: {
    marginBottom: 20
  },
  submit: {
    marginTop: 20
  },
  paper: {
    position: 'absolute',
    maxWidth: 500,
    top: 70,
    left: `35%`,
    //transform: `translate(-${top}%, -${left}%)`,
    backgroundColor: theme.palette.background.paper,
    //border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  hideAlert: {
    display: 'none'
  },
  showAlert: {
    display: 'flex'
  }
}));

export default function ({open, onClose}) {
  const classes = useStyles();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [alert, setAlert] = useState({
    show: false,
    severity: '',
    message: ''
  })
  // const [showAlert, setShowAlert] = useState(false);
  // const [alertSeverity, setAlertSeverity] = useState('')
  // const [alertMessage, setAlertMessage] = useState('')
  
  const id = JSON.parse(localStorage.getItem('user')).userId;
  
  const changeHandler = event => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }
  
  const submitHandler = async () => {
    axios.put(`http://localhost:5000/auth/changepswd/${id}`, form)
      .then(resp => {
        //alert(resp.data.message)
        setAlert({
          show: true,
          severity: 'success',
          message: resp.data.message
        })
      })
      .catch(err => {
        setAlert({
          show: true,
          severity: 'error',
          message: 'Неправильний пароль'
        })
      })
  }
  
  return (
    <Modal open={open} onClose={onClose}>
      <div className={classes.paper}>
        <h1>Змінити пароль</h1>
        <form noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                label="Старий пароль"
                name="currentPassword"
                type="password"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                label="Новий пароль"
                name="newPassword"
                type="password"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                label="Підтвердити пароль"
                name="confirmPassword"
                type="password"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={submitHandler}
              >
                Готово
              </Button>
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
        </form>
      </div>
    </Modal>
  )
}