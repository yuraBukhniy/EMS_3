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
import convertDate from "../../components/ConvertDate";

const useStyles = makeStyles((theme) => ({
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
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  cancel: {
    margin: theme.spacing(3, 0, 2),
    marginLeft: 10
  },
}));

export default function LeaveDetails({lead}) {
  const classes = useStyles();
  const [leave, setLeave] = useState({});
  //const [status, setStatus] = useState('');
  // const leadUsername = JSON.parse(localStorage.getItem('user')).username;
  const leaveId = useParams().id;
  
  useEffect(() => {
    axios.get(`http://localhost:5000/leave/${leaveId}`)
      .then(res => {
        setLeave(res.data)
      })
  }, []);
  
  function submitHandler() {
    axios.patch(`http://localhost:5000/leave/status/${leaveId}`, {status: 'Прийнято'})
      .then(res => {
        console.log(res.data)
      })
    //window.location = '/service';
  }
  
  function rejectHandler() {
    axios.patch(`http://localhost:5000/leave/status/${leaveId}`, {status: 'Відхилено'})
      .then(res => {
        console.log(res.data)
      })
    //window.location = '/service';
  }
  
  function generateReport() {
    axios.post(`http://localhost:5000/leave/report/${leaveId}`, {
      ...leave,
      startDate: convertDate(leave.startDate),
      endDate: convertDate(leave.endDate)
    })
      .then(res => {
        console.log(res.data)
      })
  }
  
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Typography className={classes.marginDown} variant='h4'>
          Запит на відпустку
        </Typography>
        <Typography>
          Дата початку: {convertDate(leave.startDate)}
        </Typography>
        <Typography>
          Дата закінчення: {convertDate(leave.endDate)}
        </Typography>
        <Typography>
          Тип: {leave.type}
        </Typography>
        <Typography>
          Тривалість: {leave.days} {leave.days === 1 ? 'робочий день' : leave.days < 5 ? 'робочих дні' : 'робочих днів'}
        </Typography>
        <Typography>
          Статус: {leave.status}
        </Typography>
        <Typography variant='h6' className={classes.marginUp}>
          Працівник: {leave.author ? `${leave.author.firstName} ${leave.author.lastName}` : null}
        </Typography>
        <Typography>
          Кількість днів, доступна працівнику для відпустки:
        </Typography>
        
          {leave.author ?
            <ul>
              <li>
                оплачувана: {leave.author.leavesAvailable ?
                `${leave.author.leavesAvailable.paid}` : null}
              </li>
              <li>
                неоплачувана: {leave.author.leavesAvailable ?
                `${leave.author.leavesAvailable.unpaid}` : null}
              </li>
              <li>
                лікарняні: {leave.author.leavesAvailable ?
                `${leave.author.leavesAvailable.illness}` : null}
              </li>
            </ul> : null}
        
        <Typography className={classes.marginUp} variant='h5'>
          Опис
        </Typography>
        <Divider />
        <Typography variant='h6'>
          {leave.description}
        </Typography>
        {/*<Typography className={classes.marginUp} variant='h5'>*/}
        {/*  Відповідь*/}
        {/*</Typography>*/}
        {/*<Divider />*/}
        {/*<Typography className={classes.marginDown} color="h6">*/}
        {/*  {leave.reply || 'Немає відповіді'}*/}
        {/*</Typography>*/}
        {lead && leave.status === 'Очікує підтвердження' ?
          <>
            <Button
              type="button"
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={submitHandler}
            >
              Прийняти
            </Button>
            <Button
              type="button"
              variant="contained"
              color="secondary"
              className={classes.cancel}
              onClick={rejectHandler}
            >
              Відхилити
            </Button>
          </> : null}
        <Button
          type="button"
          variant="contained"
          color="default"
          className={classes.cancel}
          onClick={generateReport}
        >
          Звіт у PDF
        </Button>
      </Grid>
      
    </Grid>
  )
}