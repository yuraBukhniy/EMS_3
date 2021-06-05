import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableCell from "@material-ui/core/TableCell";
import convertDate from "../../components/ConvertDate";
import Settings from "./Settings";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Skeleton from '@material-ui/lab/Skeleton';
import {LinearProgress} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: 8
  },
  marginDown: {
    marginBottom: 20,
  },
  table1: {
    maxWidth: 900,
    marginBottom: 20,
  },
  table2: {
    maxWidth: 1000,
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
  loader: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    color: '#888888'
  },
  linearLoader: {
    width: 1000,
    color: '#888888'
  }
}));

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#777777',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

export default function ({role}) {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [payDate, setPayDate] = useState('')
  const [openSettings, setOpenSettings] = useState(false);
  const [payroll, setPayroll] = useState([]);
  const userId = JSON.parse(localStorage.getItem('user')).userId;
  
  useEffect(() => {
    axios.get(`http://localhost:5000/payment/${userId}`)
      .then(res => {
        setPayDate(res.data.payDate)
        setPayments(res.data.payments)
      })
      .then(res => role !== 'admin' ? setLoading(false) : null)
    if(role === 'admin') {
      // axios.post(`http://localhost:5000/payment/payroll`)
      //   .then(res => {
      //
      //   })
      axios.get(`http://localhost:5000/payment`)
        .then(res => {
          setPayroll(res.data)
        })
        .then(res => setLoading(false))
    }
  }, []);
  
  const headers = ["Дата нарахування", "Ставка (у грн)", "Єдиний податок, грн", "ЄСВ, грн", "Сума виплати", "Доплати", "Відрахування"]
  const headers2 = ["Дата нарахування", "Ім'я", "Ставка (у грн)", "Єдиний податок, грн", "ЄСВ, грн", "Сума виплати", "Доплати", "Відрахування"]
  
  return loading ?
    <CircularProgress size={100} className={classes.loader} /> : (
    <>
      <h1>Зарплатні відомості</h1>
      {role === 'admin' ?
        <Button className={classes.button} variant="contained"
          onClick={() => setOpenSettings(true)}
        >Налаштування</Button> : null}
  
      <Typography className={classes.marginDown} variant='h6'>
        Дата наступного нарахування: {convertDate(payDate)}
      </Typography>
      <TableContainer component={Paper} className={classes.table1}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              {headers.map(header => (
                <StyledTableCell key={headers.indexOf(header)}>{header}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          {payments.length ?
            <TableBody>
              {payments.map((row) => (
                <StyledTableRow key={row._id}>
                  <StyledTableCell component="th" scope="row">
                    {convertDate(row.date)}
                  </StyledTableCell>
                  <StyledTableCell>{row.salary.toFixed(2)}</StyledTableCell>
                  <StyledTableCell>{row.singleTax.toFixed(2)}</StyledTableCell>
                  <StyledTableCell>{row.contribTax}</StyledTableCell>
                  <StyledTableCell><b>{row.sum.toFixed(2)}</b></StyledTableCell>
                  <StyledTableCell>{row.premium ? row.premium.toFixed(2) : 0}</StyledTableCell>
                  <StyledTableCell>-{row.deduction ? row.deduction.toFixed(2) : 0}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody> : null}
        </Table>
      </TableContainer>
  
      {role === 'admin' ?
        <>
          <Typography className={classes.marginDown} variant='h5'>
            Зарплати працівників за останній місяць
          </Typography>
          <TableContainer component={Paper} className={classes.table2}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  {headers2.map(header => (
                    <StyledTableCell key={headers2.indexOf(header)}>{header}</StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {payroll.map((row) => (
                  <StyledTableRow key={row._id}>
                    <StyledTableCell component="th" scope="row">
                      {convertDate(row.date)}
                    </StyledTableCell>
                    <StyledTableCell>{row.employee.firstName + ' ' + row.employee.lastName}</StyledTableCell>
                    <StyledTableCell>{row.salary.toFixed(2)}</StyledTableCell>
                    <StyledTableCell>{row.singleTax.toFixed(2)}</StyledTableCell>
                    <StyledTableCell>{row.contribTax}</StyledTableCell>
                    <StyledTableCell><b>{row.sum.toFixed(2)}</b></StyledTableCell>
                    <StyledTableCell>{row.premium ? row.premium.toFixed(2) : 0}</StyledTableCell>
                    <StyledTableCell>-{row.deduction ? row.deduction.toFixed(2) : 0}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </> : null}
  
      <Settings open={openSettings} onClose={() => setOpenSettings(false)}/>
    </>
  )
}