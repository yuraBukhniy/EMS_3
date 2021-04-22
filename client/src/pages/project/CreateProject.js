import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from "axios";
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
}));

export default function CreateProject() {
  const [projectData, setProjectData] = useState({
    code: '',
    name: '',
    description: '',
    // managers: 0,
    // leads: 0,
    // devs: 0,
    // testers: 0
  });
  // const [structure, setStructure] = useState({
  //   managers: false,
  //   leads: false,
  //   devs: false,
  //   testers: false,
  //   designers: false,
  //   analysts: false,
  //   recruiters: false,
  //   specialists: false
  // });
  
  const changeHandler = event => {
    setProjectData({
      ...projectData,
      [event.target.name]: event.target.value
    })
  }
  
  const buttonHandler = async () => {
    axios.post('http://localhost:5000/project/create', projectData)
      .then(resp => {
        alert(resp.data.message)
        window.location = '/'
      })
  }
  
  // function handleChange(event) {
  //   setStructure({ ...structure, [event.target.name]: event.target.checked });
  // }
  
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
  
            {/*<Grid item xs={12}>*/}
            {/*  Визначіть структуру персоналу проекту*/}
            {/*  <FormControl component="fieldset" className={classes.formControl}>*/}
            {/*    <FormGroup>*/}
            {/*      <FormControlLabel*/}
            {/*        control={<Checkbox onChange={handleChange} name="managers" />}*/}
            {/*        label="Gilad Gray"*/}
            {/*      />*/}
            {/*      <FormControlLabel*/}
            {/*        control={<Checkbox onChange={handleChange} name="leads" />}*/}
            {/*        label="Jason Killian"*/}
            {/*      />*/}
            {/*      <FormControlLabel*/}
            {/*        control={<Checkbox onChange={handleChange} name="devs" />}*/}
            {/*        label="Antoine Llorca"*/}
            {/*      />*/}
            {/*      <FormControlLabel*/}
            {/*        control={<Checkbox onChange={handleChange} name="testers" />}*/}
            {/*        label="Gilad Gray"*/}
            {/*      />*/}
            {/*      <FormControlLabel*/}
            {/*        control={<Checkbox onChange={handleChange} name="designers" />}*/}
            {/*        label="Jason Killian"*/}
            {/*      />*/}
            {/*      <FormControlLabel*/}
            {/*        control={<Checkbox onChange={handleChange} name="analysts" />}*/}
            {/*        label="Antoine Llorca"*/}
            {/*      />*/}
            {/*      <FormControlLabel*/}
            {/*        control={<Checkbox onChange={handleChange} name="recruiters" />}*/}
            {/*        label="Jason Killian"*/}
            {/*      />*/}
            {/*      <FormControlLabel*/}
            {/*        control={<Checkbox onChange={handleChange} name="specialists" />}*/}
            {/*        label="Antoine Llorca"*/}
            {/*      />*/}
            {/*    </FormGroup>*/}
            {/*  </FormControl>*/}
            {/*</Grid>*/}
            
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