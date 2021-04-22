import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from "axios";

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
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  cancel: {
    margin: theme.spacing(3, 0, 2),
    marginLeft: 10
  }
}));

export default function NewRequest() {
  const userId = JSON.parse(localStorage.getItem('user')).userId;
  const [request, setRequest] = useState({
    title: '',
    description: '',
    author: userId,
  });
  
  // useEffect(() => {
  //   axios.get(`http://localhost:5000/employees/team/${leadUsername}`)
  //     .then(res => {
  //       setEmployees(res.data)
  //     })
  // }, []);
  
  const changeHandler = event => {
    setRequest({
      ...request,
      [event.target.name]: event.target.value
    })
  }
  
  const buttonHandler = async () => {
    axios.post('http://localhost:5000/service/new', request)
      .then(resp => {
        console.log(resp.data)
      })
    //window.location = '/tasks';
    //console.log({taskData, assigned})
  };
  
  const cancelHandler = () => {
    window.location = '/service';
  }
  
  const classes = useStyles();
  
  return (
    <Container component="main" maxWidth="sm">
      <div className={classes.paper}>
        <h1>Створити заявку</h1>
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
                label="Опис заявки"
                name="description"
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