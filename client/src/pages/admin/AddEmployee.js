import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from "@material-ui/core/Select";
import NativeSelect from '@material-ui/core/NativeSelect';
import axios from "axios";
import {FormControl} from "@material-ui/core";

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

export default function () {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    role: '',
    password: '',
    email: '',
    phone: '',
    seniority: '',
    position: '',
    //project: '',
    manager: '',
    salary: 0
  });
  const [project, setProject] = useState('');
  const [projects, setProjects] = useState([]);
  const [leads, setLeads] = useState([]);
  
  useEffect(() => {
    axios.get('http://localhost:5000/project/get/names')
      .then(res => {
        setProjects(res.data)
      })
  }, [])
  
  useEffect(() => {
    if(project) {
      axios.get(`http://localhost:5000/employees/leads/${project}`)
        .then(res => {
          setLeads(res.data)
        })
    }
  }, [project])
  
  const changeHandler = event => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }
  
  const changeProjectHandler = event => {
    setProject(event.target.value)
  }
  
  const buttonHandler = async () => {
    axios.post('http://localhost:5000/auth/register', {...form, project})
      .then(resp => {
        alert(resp.data.message)
        window.location = '/employees';
      })
  };
  
  const cancelHandler = () => {
    window.location = '/employees';
  }
  
  const classes = useStyles();
  
  const seniorities = ['Trainee', 'Junior', 'Middle', 'Senior', 'Lead', 'Project Manager']
  
  return (
    <Container component="main" maxWidth="sm">
      <div className={classes.paper}>
        <h1>Додати працівника</h1>
        <form className={classes.form} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                label="Ім'я"
                name="firstName"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                label="Прізвище"
                name="lastName"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                label="Ім'я користувача"
                name="username"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                defaultValue=''
                variant="outlined"
                size='small'
                fullWidth
                label="Роль"
                name="role"
                onChange={changeHandler}
              >
                <MenuItem value={'employee'}>employee</MenuItem>
                <MenuItem value={'teamLead'}>team lead</MenuItem>
                <MenuItem value={'manager'}>manager</MenuItem>
                <MenuItem value={'HR'}>HR</MenuItem>
                <MenuItem value={'admin'}>admin</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                label="Пароль"
                name="password"
                type="password"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={7}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                label="Ел. пошта"
                name="email"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                label="Номер телефону"
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
                label="Рівень"
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
                label="Посада"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                select
                defaultValue={''}
                variant="outlined"
                size='small'
                fullWidth
                name="project"
                label="Проєкт"
                onChange={changeProjectHandler}
              >
                {projects.map(proj =>
                  <MenuItem key={proj.code} value={proj._id}>{proj.name}</MenuItem>
                )}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                select
                disabled={!project}
                defaultValue=''
                variant="outlined"
                size='small'
                fullWidth
                name="supervisor"
                label="Керівник"
                onChange={changeHandler}
              >
                {leads.map(lead =>
                  <MenuItem key={lead._id} value={lead.username}>
                    {lead.firstName} {lead.lastName} ({lead.seniority} {lead.position})
                  </MenuItem>
                )}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                name="salary"
                label="Зарплата"
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
            ОК
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