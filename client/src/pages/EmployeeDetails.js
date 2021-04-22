import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import convertDate from "../components/ConvertDate";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
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
});

export default function UserPage() {
  const classes = useStyles();
  const [user, setUser] = useState({});
  let id = useParams().id;
  if(!id) {
    id = JSON.parse(localStorage.getItem('user')).userId;
  }
  
  useEffect(() => {
    axios.get(`http://localhost:5000/employees/${id}`)
      .then(res => {
        setUser(res.data)
      })
  }, []);

  return (
    <>
      <Typography className={classes.marginDown} variant='h4'>
        Інформація про працівника
      </Typography>
      <Typography className={classes.marginDown} variant='h5'>
        {user.firstName + " " + user.lastName}
      </Typography>
      <Typography variant="body1">
        Позиція: {user.seniority + ' ' + user.position}
      </Typography>
      <Typography variant="body1">
        Проєкт: {user.project ? user.project.name : null}
      </Typography>
      <Typography variant="body1">
        Дата прийому на роботу: {convertDate(user.registeredDate)}
      </Typography>
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
    
    </>
  );
}