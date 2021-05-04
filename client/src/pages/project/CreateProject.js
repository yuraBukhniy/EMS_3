import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from "axios";
import {Alert} from "@material-ui/lab";
import {Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  formControl: {
    margin: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  hideAlert: {
    display: 'none'
  },
  showAlert: {
    display: 'flex'
  }
}));

export default function CreateProject() {
  const [projectData, setProjectData] = useState({
    code: '',
    name: '',
    description: '',
  });
  const [alert, setAlert] = useState({
    show: false,
    severity: 'success',
    message: ''
  })
  
  const changeHandler = event => {
    setProjectData({
      ...projectData,
      [event.target.name]: event.target.value
    })
  }
  
  const buttonHandler = async () => {
    axios.post('http://localhost:5000/project/create', projectData)
      .then(resp => {
        setAlert({
          show: true,
          severity: 'success',
          message: resp.data.message
        })
        //window.location = '/'
      })
  }
  
  const classes = useStyles();
  
  return (
    <Container component="main" maxWidth="sm">
      <div className={classes.paper}>
        <h1>Створити проєкт</h1>
        <form className={classes.form} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                label="Код проєкту"
                name="code"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                label="Ім'я проєкту"
                name="name"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                size='small'
                multiline
                fullWidth
                label="Опис"
                name="description"
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
            onClick={buttonHandler}
          >
            Створити
          </Button>
        </form>
      </div>
    </Container>
  );
}