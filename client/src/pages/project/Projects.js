import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import axios from "axios";

import EditProject from "./EditProject";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 800,
  },
  button: {
    marginBottom: 20
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  paper: {
    position: 'absolute',
    maxWidth: 600,
    top: 70,
    left: `30%`,
    //transform: `translate(-${top}%, -${left}%)`,
    backgroundColor: theme.palette.background.paper,
    //border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const viewDetailsHandler = (id) => {
  window.location = `/project/${id}`
}

const getOverallAmount = obj => {
  let sum = 0
  if(typeof obj === 'object') {
    for(let item in obj) {
      sum += obj[item].amount
    }
  }
  return sum
}

export default function Projects({role}) {
  const classes = useStyles();
  const [projects, setProjects] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  
  useEffect(() => {
    axios.get('http://localhost:5000/project/get')
      .then(res => {
        setProjects(res.data)
      })
  }, []);
  
  return (
    <>
      <h1>Проєкти</h1>
      {role === 'admin' ? <Button className={classes.button} variant="contained"
               href="projects/new"
      >Новий проєкт</Button> : null}
    
      {projects.map(project => (
        <Card key={project._id} className={classes.root}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              {project.code}
            </Typography>
            <Typography variant="h5" component="h2">
              {project.name}
            </Typography>
            {role === 'admin' ?
              <Typography variant="body2" component="p">
                {project.description}
              </Typography> :
              project.estimate ? <>
                <Typography variant="h6">
                  На проєкт потрібно найняти:
                </Typography>
                <Grid container>
                  {project.estimate.managers ?
                    <Grid item xs={3}>
                      Менеджерів
                      <Typography variant="h5">
                        {project.estimate.managers.amount}
                      </Typography>
                    </Grid>
                  : null}
                  {project.estimate.leads ?
                    <Grid item xs={3}>
                      Керівників команди
                      <Typography variant="h5">
                        {project.estimate.leads.amount}
                      </Typography>
                    </Grid>
                  : null}
                  {project.estimate.devs ?
                    <Grid item xs={3}>
                      Розробників
                      <Typography variant="h5">
                        {getOverallAmount(project.estimate.devs)}
                      </Typography>
                    </Grid>
                  : null}
                  {project.estimate.testers ?
                    <Grid item xs={3}>
                      Тестувальників
                      <Typography variant="h5">
                        {getOverallAmount(project.estimate.testers)}
                      </Typography>
                    </Grid>
                  : null}
                  {project.estimate.analysts ?
                    <Grid item xs={3}>
                      Аналітиків
                      <Typography variant="h5">
                        {project.estimate.analysts.amount}
                      </Typography>
                    </Grid>
                    : null}
                  {project.estimate.designers ?
                    <Grid item xs={3}>
                      Дизайнерів
                      <Typography variant="h5">
                        {project.estimate.designers.amount}
                      </Typography>
                    </Grid>
                    : null}
                </Grid>
              </> : null}
            
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => viewDetailsHandler(project._id)}>Переглянути деталі</Button>
            {/*<Button size="small" onClick={() => setOpenModal(true)}>Edit</Button>*/}
          </CardActions>
          <Modal open={openModal} onClose={()=>setOpenModal(false)}>
            <div className={classes.paper}>
              <EditProject project={project} />
            </div>
          </Modal>
          
        </Card>
      ))}
      
    </>
  )
}