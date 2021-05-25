import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import convertDate from "../../components/ConvertDate";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import getPosition from '../../components/GetPosition';

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
  link: {
    color: 'initial'
  }
});

export default function CandDetails() {
  const classes = useStyles();
  const [candidate, setCandidate] = useState({});
  const [newCandData, setNewCandData] = useState({
    status: '',
    interviewDate: ''
  });
  const id = useParams().id;
  const projectLink = candidate.project ? `/project/${candidate.project._id}` : '';
  
  useEffect(() => {
    axios.get(`http://localhost:5000/cand/${id}`)
      .then(res => {
        setCandidate(res.data)
      })
  }, []);
  
  const changeHandler = event => {
    setNewCandData({
      ...newCandData,
      [event.target.name]: event.target.value
    })
  }
  
  function buttonHandler() {
    axios.patch(`http://localhost:5000/cand/edit/${id}`, {newCandData, candidate})
      .then(resp => {
        alert(resp.data.message)
        window.location = '/candidates';
      })
  }
  
  const cancelHandler = () => {
    window.location = '/candidates';
  }
  
  const statuses = ['В очікуванні', 'Пропозиція', 'Співбесіда не пройдена'];
  
  return (
    <>
      <Typography className={classes.marginDown} variant='h4'>
        Інформація про кандидата
      </Typography>
      <Typography className={classes.marginDown} variant='h5'>
        {candidate.firstName + " " + candidate.lastName}
      </Typography>
      <Typography variant="body1">
        Позиція: {getPosition(candidate.seniority, candidate.position)}
      </Typography>
      <Typography variant="body1">
        Проєкт:&nbsp;
        <Link className={classes.link} to={projectLink}>
          {candidate.project ? candidate.project.name : null}
        </Link>
      </Typography>
      <Typography className={classes.marginDown} variant="body1">
        Дата співбесіди: {convertDate(candidate.interviewDate)}
      </Typography>
      <Typography variant="h6">
        Контактна інформація
      </Typography>
      <Typography variant="body1">
        Email: {candidate.email}
      </Typography>
      <Typography className={classes.marginDown} variant="body1">
        Тел.: {candidate.phone}
      </Typography>
  
      <Typography variant="h6">
        Змінити дані кандидата
      </Typography>
      <Typography variant="body1">
        Поточний статус: {candidate.status}
      </Typography>
      <TextField
        select
        defaultValue={''}
        size='small'
        fullWidth
        label="Статус"
        name="status"
        className={classes.input}
        onChange={changeHandler}
      >
        {statuses.map(status =>
          <MenuItem key={status} value={status}>{status}</MenuItem>
        )}
      </TextField>
      <Typography variant="body1">
        Змінити дату співбесіди
      </Typography>
      <TextField
        type='datetime-local'
        variant="outlined"
        size='small'
        fullWidth
        name="interviewDate"
        className={classes.input}
        onChange={changeHandler}
      />
      <Grid container>
        <Button
          type="button"
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={buttonHandler}
        >
          Готово
        </Button>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          className={classes.cancel}
          onClick={cancelHandler}
        >
          Назад
        </Button>
      </Grid>
    </>
  )
}