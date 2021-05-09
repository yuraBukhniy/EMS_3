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
    backgroundColor: theme.palette.background.paper,
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
  const [data, setData] = useState({
    date: '',
    singleTax: 0,
    contribTax: 0,
  });
  const [alert, setAlert] = useState({
    show: false,
    severity: '',
    message: ''
  })
  
  const changeHandler = event => {
    let value = event.target.value;
    if(event.target.name !== 'date') value = +value;
    setData({
      ...data,
      [event.target.name]: value
    })
  }
  
  const submitHandler = async () => {
    axios.put(`http://localhost:5000/payment/settings`, data)
      .then(resp => {
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
          message: 'Помилка'
        })
      })
  }
  
  return (
    <Modal open={open} onClose={onClose}>
      <div className={classes.paper}>
        <h1>Налаштування виплат</h1>
        <form noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                label="Дата нарахування"
                name="date"
                type="date"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                label="Єдиний податок (у %)"
                name="singleTax"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                label="Єдиний соц. внесок"
                name="contribTax"
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
                Зберегти
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