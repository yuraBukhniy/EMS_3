import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";
import {Alert} from "@material-ui/lab";

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

export default function NewCandidate() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    seniority: '',
    position: '',
    project: '',
    interviewDate: '',
    interviewer: ''
  });
  const [projects, setProjects] = useState([]);
  const [alert, setAlert] = useState({
    show: false,
    severity: 'success',
    message: ''
  })
  
  useEffect(() => {
    axios.get('http://localhost:5000/project/get/names')
      .then(res => {
        setProjects(res.data)
      })
  }, [])
  
  const changeHandler = event => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }
  
  const cancelHandler = () => {
    window.location = '/candidates';
  }
  
  const buttonHandler = async () => {
    axios.post('http://localhost:5000/cand/add', form)
      .then(resp => {
        setAlert({
          show: true,
          severity: 'success',
          message: resp.data.message
        })
        //window.location = '/candidates'
      })
  }
  
  const classes = useStyles();
  const seniorities = ['Trainee', 'Junior', 'Middle', 'Senior', 'Lead']
  
  return (
    <Container component="main" maxWidth="sm">
      <div className={classes.paper}>
        <h1>???????????? ??????????????????</h1>
        <form className={classes.form} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                label="????'??"
                name="firstName"
                autoFocus
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                label="????????????????"
                name="lastName"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                label="Email"
                name="email"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                label="??????????????"
                name="phone"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                defaultValue=''
                variant="outlined"
                size='small'
                fullWidth
                name="seniority"
                label="????????????"
                onChange={changeHandler}
              >
                {seniorities.map(item =>
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                )}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                name="position"
                label="??????????????"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                variant="outlined"
                size='small'
                fullWidth
                name="project"
                label="????????????"
                onChange={changeHandler}
              >
                {projects.map(proj =>
                  <MenuItem key={proj.code} value={proj._id}>{proj.name}</MenuItem>
                )}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type='datetime-local'
                variant="outlined"
                size='small'
                fullWidth
                label="???????? ????????????????????"
                name="interviewDate"
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
            ????????????
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
        </form>
      </div>
    </Container>
  );
}