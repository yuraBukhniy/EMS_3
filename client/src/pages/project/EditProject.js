import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles({
  marginDown: {
    marginBottom: 20,
  },
  marginUp: {
    marginTop: 20,
  },
});

export default function ({project}) {
  const classes = useStyles();
  const [projectData, setProjectData] = useState({
    name: project.name,
    description: project.description
  });
  
  useEffect(() => {
    // axios.get(`http://localhost:5000/project/get/${projectId}`)
    //   .then(res => {
    //     setProject(res.data)
    //   })
  }, []);
  
  const changeHandler = event => {
    setProjectData({
      ...projectData,
      [event.target.name]: event.target.value
    })
  }
  
  const buttonHandler = async () => {
    axios.patch(`http://localhost:5000/project/edit/${project._id}`, projectData)
      .then(resp => {
        console.log(resp.data)
      })
    // window.location = '/'
    //console.log(projectData)
  }
  
  return (
    <Container component="main" maxWidth="sm">
      <div className={classes.paper}>
        <h1>Edit Project</h1>
        <form className={classes.form} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                size='small'
                fullWidth
                id="projectName"
                label="Project Name"
                value={projectData.name}
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
                id="description"
                label="Description"
                value={projectData.description}
                name="description"
                onChange={changeHandler}
              />
            </Grid>
            
          </Grid>
          <Button
            type="button"
            variant="contained"
            color="primary"
            className={classes.marginUp}
            onClick={buttonHandler}
          >
            Submit
          </Button>
        </form>
      </div>
    </Container>
  )
}