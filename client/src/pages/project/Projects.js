import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import axios from "axios";
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
  const userId = JSON.parse(localStorage.getItem('user')).userId;
  
  useEffect(() => {
    axios.get('http://localhost:5000/project/get')
      .then(res => {
        setProjects(res.data)
      })
    //axios.post(`http://localhost:5000/payment/${userId}`).then()
  }, []);
  
  const positions = {
    managers: 'Менеджерів',
    leads: 'Керівників команди',
    devs: 'Розробників',
    testers: 'Тестувальників',
    analysts: 'Аналітиків',
    designers: 'Дизайнерів'
  };
  
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
                  {Object.keys(project.estimate).map(item =>
                    item === 'devs' || item === 'testers' ?
                      getOverallAmount(project.estimate[item]) ?
                        <Grid item xs={4}>
                          {positions[item]}
                          <Typography variant="h5">
                            {getOverallAmount(project.estimate[item])}
                          </Typography>
                        </Grid> : null :
                      
                    project.estimate[item].amount ?
                    <Grid item xs={4}>
                      {positions[item]}
                      <Typography variant="h5">
                        {project.estimate[item].amount}
                      </Typography>
                    </Grid> : null
                  )}
                </Grid>
              </> : null}
            
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => viewDetailsHandler(project._id)}>Переглянути деталі</Button>
          </CardActions>
          {/*<Modal open={openModal} onClose={()=>setOpenModal(false)}>*/}
          {/*  <div className={classes.paper}>*/}
          {/*    <EditProject project={project} />*/}
          {/*  </div>*/}
          {/*</Modal>*/}
          
        </Card>
      ))}
      
    </>
  )
}