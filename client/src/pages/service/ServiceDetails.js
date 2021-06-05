import React, {useEffect, useState} from "react";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import convertDate from "../../components/ConvertDate";

const useStyles = makeStyles({
  marginDown: {
    marginBottom: 20,
  },
  marginUp: {
    marginTop: 20,
  },
  edit: {
    maxWidth: '40%'
  },
  input: {
    maxWidth: 400,
    marginBottom: 20
  },
});


export default function ServiceDetails({id, admin}) {
  const classes = useStyles();
  const [request, setRequest] = useState({});
  const [status, setStatus] = useState('');
  const [reply, setReply] = useState('');
  
  useEffect(() => {
    axios.get(`http://localhost:5000/service/${id}`)
      .then(res => {
        setRequest(res.data)
      })
  }, [request]);
  
  function changeStatusHandler(value) {
    setStatus(value)
  }
  
  function changeReplyHandler(value) {
    setReply(value)
  }
  
  function buttonHandler() {
    axios.patch(`http://localhost:5000/service/change/${id}`, {status, reply})
      .then(resp => {
        console.log(resp.data)
      })
    //window.location = '/service';
  }
  
  const statusesIQ = ['В процесі', 'Відхилено'];
  const statusesIP = ['Виконано', 'Відхилено'];
  const statusesDone = ['Закрито', 'В процесі'];
  const statuses = request.status === 'У черзі' ? statusesIQ
    : request.status === 'В процесі' ? statusesIP
    : request.status === 'Виконано' ? statusesDone
    : ['Відхилено', 'В процесі', 'Виконано', 'Закрито'];
  
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
      <Typography className={classes.marginDown} variant='h4'>
        {request.title}
      </Typography>
      <Typography color="textSecondary">
        Дата створення: {convertDate(request.date)}
      </Typography>
      <Typography color="textSecondary">
        Статус: {request.status}
      </Typography>
      <Typography color="textSecondary">
        Автор: {request.author ? `${request.author.firstName} ${request.author.lastName}` : null}
      </Typography>
      <Typography className={classes.marginUp} variant='h5'>
        Опис
      </Typography>
      <Divider />
      <Typography variant='h6'>
        {request.description}
      </Typography>
      <Typography className={classes.marginUp} variant='h5'>
        Відповідь
      </Typography>
      <Divider />
      <Typography className={classes.marginDown} color="h6">
        {request.reply || 'Немає відповіді'}
      </Typography>
      </Grid>
  
      {admin || request.status === 'Виконано' ? (
        <Grid item xs={12} md={6}>
          <Grid item xs={12}>
          <Typography className={classes.marginUp} variant='h5'>
            Редагувати заявку
          </Typography>
          <TextField
            select
            size='small'
            fullWidth
            id="status"
            label="Статус"
            name="status"
            className={classes.input}
            onChange={event => changeStatusHandler(event.target.value)}
          >
            {statuses.map(status =>
              admin ? (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ) : (
                status === 'В процесі' || status === 'Закрито' ?
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                  : null
              )
            )}
            {/*{request.status === 'У черзі' ? (*/}
            {/*  <>*/}
            {/*    /!*<MenuItem value={'У черзі'}>У черзі</MenuItem>*!/*/}
            {/*    <MenuItem value={'В процесі'}>В процесі</MenuItem>*/}
            {/*    <MenuItem value={'Відхилено'}>Відхилено</MenuItem>*/}
            {/*  </>*/}
            {/*) : request.status === 'В процесі' ? (*/}
            {/*  <>*/}
            {/*    <MenuItem value={'У черзі'}>У черзі</MenuItem>*/}
            {/*    <MenuItem value={'Виконано'}>Виконано</MenuItem>*/}
            {/*  </>*/}
            {/*) : request.status === 'Виконано' ? (*/}
            {/*  <>*/}
            {/*    <MenuItem value={'В процесі'}>В процесі</MenuItem>*/}
            {/*  </>*/}
            {/*) : <MenuItem value={request.status}>request.status</MenuItem>}*/}
            
            {/*<MenuItem value={'У черзі'}>У черзі</MenuItem>*/}
            {/*<MenuItem value={'Відхилено'}>Відхилено</MenuItem>*/}
            {/*<MenuItem value={'В процесі'}>В процесі</MenuItem>*/}
            {/*<MenuItem value={'Виконано'}>Виконано</MenuItem>*/}
            {/*<MenuItem value={'Закрито'}>Закрито</MenuItem>*/}
          </TextField>
          </Grid>
          <Grid item xs={12}>
          <TextField
            variant="outlined"
            size='small'
            multiline
            fullWidth
            id="description"
            label="Відповідь"
            name="description"
            className={classes.input}
            onChange={event => changeReplyHandler(event.target.value)}
          />
          </Grid>
          <Grid item xs={12}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={buttonHandler}
          >
            Зберегти
          </Button>
          </Grid>
        </Grid>
      ) : null}
    </Grid>
  )
}