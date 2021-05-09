import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import convertDate from "../../components/ConvertDate";
import Grid from "@material-ui/core/Grid";
import {TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";

const useStyles = makeStyles({
  marginDown: {
    marginBottom: 20,
  },
  marginUp: {
    marginTop: 20,
  },
  root: {
    display: 'flex',
    marginBottom: 8
  },
  avatar: {
    alignSelf: 'center',
    marginLeft: 10
  },
  submit: {
    marginTop: 10
  },
});

const getOverallAmount = obj => {
  let sum = 0
  for(let item in obj) {
    sum += obj[item].amount
  }
  return sum
}

export default function ProjectDetails({role}) {
  const classes = useStyles();
  const [project, setProject] = useState({});
  const [employees, setEmployees] = useState([])
  
  const projectIdParams = useParams().id;
  const projectId = role === 'manager' ? JSON.parse(localStorage.getItem('user')).project : projectIdParams;
  
  useEffect(() => {
    axios.get(`http://localhost:5000/project/get/${projectId}`)
      .then(res => {
        setProject(res.data)
      })
    axios.get(`http://localhost:5000/employees/project/${projectId}`)
      .then(res => {
        setEmployees(res.data)
      })
  }, []);
  
  return (
    <>
      <Typography className={classes.marginDown} variant='h4'>
        {project.name}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Typography color="textSecondary">
            Код проєкту: {project.code}
          </Typography>
          <Typography className={classes.marginDown} color="textSecondary">
            Дата старту: {convertDate(project.startDate)}
          </Typography>
          <Typography className={classes.marginUp} variant='h5'>
            Опис
          </Typography>
          <Divider />
          <Typography className={classes.marginUp} variant='h6'>
            {project.description}
          </Typography>
          
          <Grid item xs={12}>
            {project.estimate ? (
              <>
                <Typography className={classes.marginUp} variant='h5'>
                  Потреби в персоналі
                </Typography>
                <Divider />
                <Typography className={classes.marginUp} variant='h6'>
                  На проєкт потрібно найняти:
                </Typography>
                <Typography className={classes.marginUp} variant='h6'>
                  <ul>
                    {project.estimate.managers ? <li>Менеджерів: {project.estimate.managers.amount} ({project.estimate.managers.salary} $)</li> : null}
                    {project.estimate.leads ? <li>Керівників команди: {project.estimate.leads.amount} ({project.estimate.leads.salary} $)</li> : null}
                    {project.estimate.devs ? (
                      <>
                        <li>Розробників: {getOverallAmount(project.estimate.devs)}, в тому числі:</li>
                        <ul>
                          {project.estimate.devs.trainee ? <li>Trainee: {project.estimate.devs.trainee.amount} ({project.estimate.devs.trainee.salary} $)</li> : null}
                          {project.estimate.devs.junior ? <li>Junior: {project.estimate.devs.junior.amount} ({project.estimate.devs.junior.salary} $)</li> : null}
                          {project.estimate.devs.middle ? <li>Middle: {project.estimate.devs.middle.amount} ({project.estimate.devs.middle.salary} $)</li> : null}
                          {project.estimate.devs.senior ? <li>Senior: {project.estimate.devs.senior.amount} ({project.estimate.devs.senior.salary} $)</li> : null}
                        </ul>
                      </>
                    ) : null}
                    {project.estimate.testers ? (
                      <>
                        <li>Тестувальників: {getOverallAmount(project.estimate.testers)}, в тому числі:</li>
                        <ul>
                          {project.estimate.testers.trainee ? <li>Trainee: {project.estimate.testers.trainee.amount} ({project.estimate.testers.trainee.salary} $)</li> : null}
                          {project.estimate.testers.junior ? <li>Junior: {project.estimate.testers.junior.amount} ({project.estimate.testers.junior.salary} $)</li> : null}
                          {project.estimate.testers.middle ? <li>Middle: {project.estimate.testers.middle.amount} ({project.estimate.testers.middle.salary} $)</li> : null}
                          {project.estimate.testers.senior ? <li>Senior: {project.estimate.testers.senior.amount} ({project.estimate.testers.senior.salary} $)</li> : null}
                        </ul>
                      </>
                    ) : null}
                    {project.estimate.analysts ? <li>Аналітиків: {project.estimate.analysts.amount} ({project.estimate.analysts.salary} $)</li> : null}
                    {project.estimate.designers ? <li>Дизайнерів: {project.estimate.designers.amount} ({project.estimate.designers.salary} $)</li> : null}
                  </ul>
                </Typography>
              </>
            ) : null}
          </Grid>
      
          {role === 'manager' ?
            <Grid item xs={12}>
              <Button
                variant="contained"
                href={`/project/estimate/${projectId}`}
                className={classes.marginUp}
              >
                Керування структурою персоналу
              </Button>
            </Grid> : null}
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Typography variant="h5" className={classes.marginDown}>
            Працівники проєкту
          </Typography>
          {employees.map(employee => (
            <Grid key={employee._id} item xs={12} >
              <Card key={employee._id} className={classes.root}>
                <Avatar className={classes.avatar} />
                <CardContent>
                  <Typography variant="h6">
                    {/*<Link className={classes.link} to={manager ? `/team/${employee._id}` : `/${employee._id}`}>*/}
                      {employee.firstName + " " + employee.lastName}
                    {/*</Link>*/}
                  </Typography>
          
                  <Typography variant="body2" component="p">
                    {employee.seniority + " " + employee.position}
                  </Typography>
          
                  {employee.leaves.map(leave =>
                    leave.status === 'Прийнято' &&
                    (new Date(leave.startDate).getDate() <= new Date(Date.now()).getDate()
                    ) &&
                    (new Date(Date.now()).getDate() <= new Date(leave.endDate).getDate()
                    ) ?
                      <Typography key={leave._id} variant="body2" color='secondary'>
                        У відпустці до {convertDate(leave.endDate)}
                      </Typography>
                      : null
                  )}
        
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  )
}