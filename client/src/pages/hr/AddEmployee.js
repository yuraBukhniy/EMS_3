import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Modal from "@material-ui/core/Modal";
import axios from "axios";

const useStyles = makeStyles(theme => ({
  
  paper: {
    position: 'absolute',
    maxWidth: 600,
    top: 70,
    left: `30%`,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  button: {
    marginTop: 20
  }
}));

export default function AddEmployee(props) {
  const [form, setForm] = useState({
    id: props.id,
    username: '',
    seniority: '',
    position: '',
    role: '',
    teamLead: '',
    salary: '',
  });
  
  const [openModal, setOpenModal] = useState(false);
  const classes = useStyles();
  
  const changeHandler = event => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }
  
  const buttonHandler = async () => {
    // axios.post('http://localhost:5000/cand/createuser', form)
    //   .then(resp => {
    //     console.log(resp.data)
    //   })
    //window.location = '/candidates'
    console.log(form)
  }
  
  return (
    <Modal open={props.open} onClose={props.close}>
      <div className={classes.paper}>
        <h1>Enter additional employee's data</h1>
        <form noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                size='small'
                required
                fullWidth
                //id="username"
                label="Username"
                name="username"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                size='small'
                required
                fullWidth
                //id="seniority"
                label="Seniority"
                name="seniority"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                size='small'
                required
                fullWidth
                // id="position"
                label="Position"
                name="position"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                size='small'
                required
                fullWidth
                //id="teamLead"
                label="Team Lead"
                name="teamLead"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                size='small'
                required
                fullWidth
                //id="role"
                label="Role"
                name="role"
                onChange={changeHandler}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                size='small'
                required
                fullWidth
                //id="salary"
                label="Salary"
                name="salary"
                onChange={changeHandler}
              />
            </Grid>
          </Grid>
          <Button
            type="button"
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={buttonHandler}
          >
            Submit
          </Button>
        </form>
      </div>
    </Modal>
  )
  
}