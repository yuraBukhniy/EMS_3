import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import convertDate from "../../components/ConvertDate";
import Grid from "@material-ui/core/Grid";
import {CircularProgress, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import getEstimate from "./EstimateOutput";

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
  loader: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    color: '#888888'
  },
  link: {
    textDecoration: 'none',
    color: 'initial'
  }
});

function isInVacation(start, end) {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  const today = Date.now();
  return startDate <= today && today <= (endDate + 24*3600*1000);
}

export default function ProjectDetails({role}) {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState({estimate: {}});
  const [employees, setEmployees] = useState([])
  
  const projectIdParams = useParams().id;
  const projectId = role === 'manager' ? JSON.parse(localStorage.getItem('user')).project : projectIdParams;
  
  useEffect(() => {
    axios.get(`http://localhost:5000/project/get/${projectId}`)
      .then(res => {
        setProject(res.data)
      })
      .then(res => setLoading(false))
    axios.get(`http://localhost:5000/employees/project/${projectId}`)
      .then(res => {
        setEmployees(res.data)
      })
  }, []);
  
  return loading ?
    <CircularProgress size={100} className={classes.loader} /> :
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
            {project.estimate && role !== 'employee' && role !== 'teamLead' ? (
              <>
                <Typography className={classes.marginUp} variant='h5'>
                  Потреби в персоналі
                </Typography>
                <Divider />
                <Typography className={classes.marginUp} variant='h6'>
                  На проєкт потрібно найняти:
                </Typography>
                <Typography className={classes.marginUp} variant='h6'>
                  {getEstimate(project.estimate)}
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
                    <Link className={classes.link} to={`/employee/${employee._id}`}>
                      {employee.firstName + " " + employee.lastName}
                    </Link>
                  </Typography>
          
                  <Typography variant="body2" component="p">
                    {employee.seniority + " " + employee.position}
                  </Typography>
          
                  {employee.leaves.map(leave =>
                    leave.status === 'Прийнято' && isInVacation(leave.startDate, leave.endDate) ?
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
}