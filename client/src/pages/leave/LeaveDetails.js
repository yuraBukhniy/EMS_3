import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import {useParams} from "react-router-dom";

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

export default function LeaveDetails() {
  const classes = useStyles();
  const [leave, setLeave] = useState({});
  const [status, setStatus] = useState('');
  const [reply, setReply] = useState('');
  // const leadUsername = JSON.parse(localStorage.getItem('user')).username;
  const leaveId = useParams().id;
  
  useEffect(() => {
    axios.get(`http://localhost:5000/leave/${leaveId}`)
      .then(res => {
        setLeave(res.data)
      })
  }, []);
  
  function changeStatusHandler(value) {
    setStatus(value)
  }
  
  function changeReplyHandler(value) {
    setReply(value)
  }
  
  function buttonHandler() {
    axios.patch(`http://localhost:5000/service/change/${leaveId}`, {status, reply})
      .then(resp => {
        console.log(resp.data)
      })
    //window.location = '/service';
  }
  
  const statuses = ['У черзі', 'Відхилено', 'В процесі', 'Виконано', 'Закрито'];
  
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Typography className={classes.marginDown} variant='h4'>
          {leave.description}
        </Typography>
        <Typography color="textSecondary">
          Дата початку: {leave.startDate}
        </Typography>
        <Typography color="textSecondary">
          Дата закінчення: {leave.endDate}
        </Typography>
        <Typography color="textSecondary">
          Статус: {leave.status}
        </Typography>
        <Typography color="textSecondary">
          Автор: {leave.author ? `${leave.author.firstName} ${leave.author.lastName}` : null}
        </Typography>
        {/*<Typography className={classes.marginUp} variant='h5'>*/}
        {/*  Опис*/}
        {/*</Typography>*/}
        {/*<Divider />*/}
        {/*<Typography variant='h6'>*/}
        {/*  {leave.description}*/}
        {/*</Typography>*/}
        {/*<Typography className={classes.marginUp} variant='h5'>*/}
        {/*  Відповідь*/}
        {/*</Typography>*/}
        {/*<Divider />*/}
        {/*<Typography className={classes.marginDown} color="h6">*/}
        {/*  {leave.reply || 'Немає відповіді'}*/}
        {/*</Typography>*/}
      </Grid>
      
    </Grid>
  )
}