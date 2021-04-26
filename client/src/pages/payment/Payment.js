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

const useStyles = makeStyles({
  root: {
    marginBottom: 8
  },
  marginDown: {
    marginBottom: 20,
  },
  table1: {
    maxWidth: 900,
  },
  table2: {
    maxWidth: 800,
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
});

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
  const [payments, setPayments] = useState([]);
  const [payDate, setPayDate] = useState('')
  const [openSettings, setOpenSettings] = useState(false);
  const userId = JSON.parse(localStorage.getItem('user')).userId;
  
  useEffect(() => {
    axios.get(`http://localhost:5000/payment/${userId}`)
      .then(res => {
        setPayDate(res.data.payDate)
        setPayments(res.data.payments)
      })
  }, []);
  
  const headers = ["Дата нарахування", "Ставка (у грн)", "Єдиний податок, грн", "ЄСВ, грн", "Сума виплати", "Відрахування за неопл. відп."]
  
  return (
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
          <TableBody>
            {payments.map((row) => (
              <StyledTableRow key={row._id}>
                <StyledTableCell component="th" scope="row">
                  {convertDate(row.date)}
                </StyledTableCell>
                <StyledTableCell>{row.salary}</StyledTableCell>
                <StyledTableCell>{row.singleTax}</StyledTableCell>
                <StyledTableCell>{row.contribTax}</StyledTableCell>
                <StyledTableCell><b>{row.sum}</b></StyledTableCell>
                <StyledTableCell>-{row.deduction}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Settings open={openSettings} onClose={() => setOpenSettings(false)}/>
    </>
  )
}