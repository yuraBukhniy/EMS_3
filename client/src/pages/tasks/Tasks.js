import React, {useEffect, useState} from "react";
import axios from "axios";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TaskCard from "../../components/TaskCard";
// import Card from "@material-ui/core/Card";
// import CardContent from "@material-ui/core/CardContent";
// import Typography from "@material-ui/core/Typography";
// import CardActions from "@material-ui/core/CardActions";
// import convertDate from '../../components/ConvertDate';

// import ChartistGraph from 'react-chartist'
// import Chartist from 'chartist'
// import Legend from "chartist-plugin-legend";
//import '../../components/legend.scss'

const useStyles = makeStyles({
  root: {
    //display: 'flex',
    marginBottom: 8
  },
  grid: {
    //maxWidth: 1000,
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
});

function viewDetailsHandler(id) {
  window.location = `/tasks/${id}`
}

export default function Task({role}) {
  const classes = useStyles();
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);
  const username = JSON.parse(localStorage.getItem('user')).username;
  const projectId = JSON.parse(localStorage.getItem('user')).project;
  // const url = role === 'employee' ? `http://localhost:5000/task/user/${username}`
  //   : role === 'teamLead' ? `http://localhost:5000/task/project/${projectId}`
  //   : ``
  
  useEffect(() => {
    if(role !== 'manager') {
      axios.get(`http://localhost:5000/task/user/${username}`)
        .then(res => {
          setAssignedTasks(res.data)
        })
    }
    if(role !== 'employee') {
      axios.get(`http://localhost:5000/task/project/${projectId}`)
        .then(res => {
          setProjectTasks(res.data)
        })
    }
    
  }, []);
  
  // let dataPie = {
  //   labels: ["40%", "20%", "40%"],
  //   series: [40, 20, 40]
  // }
  // let options = {
  //   plugins: [
  //     Chartist.plugins.legend({
  //       legendNames: ["40%", "20%", "40%"]
  //     })
  //   ]
  // };
  
  return (
    <>
      <h1>Завдання</h1>
      {role !== 'employee' ? <Button className={classes.button} variant="contained"
               href="/tasks/new"
      >Створити</Button> : null}
      <Grid container spacing={1} className={classes.grid}>
        {role === 'manager' ?
          <>
            <Grid item xs={12} md={6}>
              <h2>Очікують виконання/в процесі</h2>
              {projectTasks.map(task =>
                task.status !== 'Закрито' ? (
                  <TaskCard key={task._id} task={task} cardWidth={12} handler={() => viewDetailsHandler(task._id)} />
                ) : null
              )}
            </Grid>
          <Grid item xs={12} md={6}>
            <h2>Завершені</h2>
            {projectTasks.map(task =>
              task.status === 'Закрито' ? (
                <TaskCard key={task._id} task={task} cardWidth={12} handler={() => viewDetailsHandler(task._id)} />
              ) : null
            )}
          </Grid>
          </> : null}
        {role === 'teamLead' ?
          <>
          <Grid item xs={12} md={6}>
            <h2>Завдання проекту</h2>
            {projectTasks.map(task => (
              <TaskCard key={task._id} task={task} cardWidth={12} handler={() => viewDetailsHandler(task._id)} />
            ))}
          </Grid>
          <Grid item xs={12} md={6}>
            <h2>Мої завдання</h2>
            {assignedTasks.map(task => (
              <TaskCard key={task._id} task={task} cardWidth={12} handler={() => viewDetailsHandler(task._id)} />
            ))}
          </Grid>
          </>
          : null}
        {role === 'employee' ?
          <Grid item xs={12}>
            <h2>Мої завдання</h2>
            {assignedTasks.map(task =>
              <TaskCard key={task._id} task={task} cardWidth={6} handler={() => viewDetailsHandler(task._id)} />
            )}
          </Grid> : null}
      </Grid>
    </>
  )
}