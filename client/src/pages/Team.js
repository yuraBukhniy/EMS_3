import React, {useEffect, useState} from "react";
import axios from "axios";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import {Link} from "react-router-dom";
import convertDate from "../components/ConvertDate";

const useStyles = makeStyles({
  root: {
    display: 'flex',
    marginBottom: 8
  },
  grid: {
    maxWidth: 1000,
  },
  avatar: {
    alignSelf: 'center',
    marginLeft: 10
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
  link: {
    textDecoration: 'none',
    color: 'initial'
  }
});

function isInVacation(start, end) {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  const today = Date.now();
  // let result = false;
  // if(today.getMonth() === endDate.getMonth()) {
  //   result = startDate.getDate() <= today.getDate() && today.getDate() <= endDate.getDate();
  // }
  return startDate <= today && today <= (endDate + 24*3600*1000);
}

export default function Team({manager}) {
  const classes = useStyles();
  const leadUsername = JSON.parse(localStorage.getItem('user')).username;
  const project = JSON.parse(localStorage.getItem('user')).project;
  const [team, setTeam] = useState([]);
  const [employees, setEmployees] = useState([]);
  
  useEffect(() => {
    axios.get(`http://localhost:5000/employees/team/${leadUsername}`)
      .then(res => {
        setTeam(res.data)
      })
    if(manager) {
      axios.get(`http://localhost:5000/employees/project/${project}`)
        .then(res => {
          setEmployees(res.data)
        })
    }
  }, []);
  
  return (
    <>
      <h1>Мої підлеглі</h1>
      <Grid container spacing={1} className={classes.grid}>
        {team.map(employee => (
          <Grid key={employee._id} item xs={12} md={6} >
            <Card key={employee._id} className={classes.root}>
              <Avatar className={classes.avatar} />
              <CardContent>
                <Typography variant="h6">
                  <Link className={classes.link} to={manager ? `/team/${employee._id}` : `/${employee._id}`}>
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
      {manager ?
        <>
          <h1>Працівники проєкту</h1>
          <Grid container spacing={1} className={classes.grid}>
            {employees.map(employee => (
              employee.role === 'employee' ?
                <Grid key={employee._id} item xs={12} md={6}>
                <Card key={employee._id} className={classes.root}>
                  <Avatar className={classes.avatar}/>
                  <CardContent>
                    <Typography variant="h6">
                      <Link className={classes.link} to={manager ? `/team/${employee._id}` : `/${employee._id}`}>
                        {employee.firstName + " " + employee.lastName}
                      </Link>
                    </Typography>
                    <Typography variant="body2" component="p">
                      {employee.seniority + " " + employee.position}
                    </Typography>
                    <Typography variant="body2" component="p">
                      Керівник: {employee.supervisor}
                    </Typography>
                    {employee.leaves ? employee.leaves.map(leave =>
                    leave.status === 'Прийнято' && isInVacation(leave.startDate, leave.endDate) ?
                        <Typography key={leave._id} variant="body2" color='secondary'>
                          У відпустці до {convertDate(leave.endDate)}
                        </Typography>
                        : null
                    ) : null}
                  </CardContent>
                </Card>
              </Grid> : null
            ))}
          </Grid>
        </> : null}
    </>
  )
}