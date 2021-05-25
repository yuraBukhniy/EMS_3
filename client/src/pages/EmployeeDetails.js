import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import convertDate from "../components/ConvertDate";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";
import CardContent from "@material-ui/core/CardContent";
import getPosition from '../components/GetPosition';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    marginBottom: 8
  },
  avatar: {
    alignSelf: 'center',
    marginLeft: 10
  },
  marginDown: {
    marginBottom: 20,
  },
  marginUp: {
    marginTop: 20,
  },
  input: {
    maxWidth: 400,
    marginBottom: 20
  },
  cancel: {
    marginLeft: 10
  },
  loader: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    color: '#888888'
  },
  link: {
    color: 'initial'
  }
});

export default function UserPage() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [supervisor, setSupervisor] = useState({});
  let id = useParams().id;
  if(!id) {
    id = JSON.parse(localStorage.getItem('user')).userId;
  }
  const projectLink = user.project ? `/project/${user.project._id}` : '';
  
  useEffect(() => {
    axios.get(`http://localhost:5000/employees/${id}`)
      .then(res => {
        setUser(res.data.employee)
        setSupervisor(res.data.supervisor)
      })
      .then(res => setLoading(false))
  }, []);
  
  function computeExperience(date) {
    const hiredDate = new Date(date);
    const today = new Date(Date.now());
    const years = today.getFullYear() - hiredDate.getFullYear();
    let months = today.getMonth() - hiredDate.getMonth();
    if(months < 0) months += 12;
    const monthString = months === 1 ? ' місяць' : ' місяці';
    return months + monthString;
  }
  
  return loading ?
    <CircularProgress size={100} className={classes.loader} /> :
    (
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <Typography className={classes.marginDown} variant='h4'>
            Інформація про працівника
          </Typography>
          <Typography className={classes.marginDown} variant='h5'>
            {user.firstName + " " + user.lastName + " " + `(${user.username})`}
          </Typography>
          <Typography variant="body1">
            Позиція: {user.seniority + ' ' + user.position}
          </Typography>
          <Typography variant="body1">
            Проєкт:&nbsp;
            <Link className={classes.link} to={projectLink}>
              {user.project ? user.project.name : null}
            </Link>
          </Typography>
          <Typography variant="body1">
            Дата прийому на роботу: {convertDate(user.registeredDate)}
          </Typography>
          {/*<Typography variant="body1">*/}
          {/*  Стаж: {computeExperience(user.registeredDate)}*/}
          {/*</Typography>*/}
          <Typography className={classes.marginDown} variant="body1">
            Зарплата: {user.salary + " $"}
          </Typography>
          <Typography variant="h6">
            Контактна інформація
          </Typography>
          <Typography variant="body1">
            Email: {user.email}
          </Typography>
          <Typography className={classes.marginDown} variant="body1">
            Тел.: {user.phone}
          </Typography>
  
          {supervisor ?
            <>
            <Typography variant="h5">
              Керівник
            </Typography>
            <Card className={classes.root}>
              <Avatar className={classes.avatar}/>
              <CardContent>
                <Typography variant="h6">
                  {supervisor.firstName + " " + supervisor.lastName}
                </Typography>
                <Typography variant="body2" component="p">
                  {getPosition(supervisor.seniority, supervisor.position)}
                </Typography>
              </CardContent>
            </Card>
          </> : null}
      
        </Grid>
      </Grid>
    );
}