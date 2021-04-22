import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";

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
}));

export default function NewCandidate() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    project: '',
    interviewDate: '',
    interviewer: ''
  });
  const [projects, setProjects] = useState([]);
  
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
        alert(resp.data.message)
        window.location = '/candidates'
      })
  }
  
  const classes = useStyles();
  
  return (
    <Container component="main" maxWidth="sm">
      <div className={classes.paper}>
        <h1>Додати кандидата</h1>
        <form className={classes.form} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                label="Ім'я"
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
                label="Прізвище"
                name="lastName"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                label="Email"
                name="email"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                label="Телефон"
                name="phone"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                name="position"
                label="Позиція"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                variant="outlined"
                size='small'
                fullWidth
                name="project"
                label="Проєкт"
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
                label="Дата співбесіди"
                name="interviewDate"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                label="Проведе співбесіду"
                name="interviewer"
                onChange={changeHandler}
              />
            </Grid>
          </Grid>
          <Button
            type="button"
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={buttonHandler}
          >
            Додати
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