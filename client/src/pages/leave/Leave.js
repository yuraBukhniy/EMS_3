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
import {Link} from "react-router-dom";
import {ButtonGroup} from "@material-ui/core";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ListAltIcon from "@material-ui/icons/ListAlt";

const useStyles = makeStyles({
  root: {
    marginBottom: 8
  },
  table1: {
    maxWidth: 1000,
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

function viewDetailsHandler(id) {
  window.location = `/leave/${id}`
}


export default function LeaveMgmtPage({role}) {
  const classes = useStyles();
  const [leaves, setLeaves] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const userId = JSON.parse(localStorage.getItem('user')).userId;
  const username = JSON.parse(localStorage.getItem('user')).username;
  // const serverUrl = admin ? `http://localhost:5000/service`
  //   : `http://localhost:5000/leave/user/${userId}`;
  
  useEffect(() => {
    axios.get(`http://localhost:5000/leave/user/${userId}`)
      .then(res => {
        setLeaves(res.data)
      })
  }, []);
  
  useEffect(() => {
      axios.get(`http://localhost:5000/leave/team/${username}`)
        .then(res => {
          setPendingLeaves(res.data)
        })
    }, []);
  
  function setStatus(id, status) {
    axios.patch(`http://localhost:5000/leave/status/${id}`, {status})
      .then(res => {
        console.log(res.data)
      })
  }
  
  const headers1 = ["Ім'я працівника", "Тип відпустки", "Початок", "Кінець", "Статус", "Дії"]
  const headers2 = ["Тип відпустки", "Початок", "Кінець", "Статус", "Деталі"]
  
  return (
    <div>
      <h1>Керування відпустками</h1>
      <Button className={classes.button} variant="contained"
              href="leave/new"
      >Створити запит</Button>
  
      {role === 'teamLead' ?
        <>
        <h1>Запити від підлеглих</h1>
        <TableContainer component={Paper} className={classes.table1}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {headers1.map(header => (
                  <StyledTableCell key={header}>{header}</StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingLeaves.map((row) => (
                <StyledTableRow key={row._id}>
                  <StyledTableCell component="th" scope="row">
                    {/*<Link to={`/leave/${row._id}`}>*/}
                      {row.author ? `${row.author.firstName} ${row.author.lastName}` : null}
                    {/*</Link>*/}
                  </StyledTableCell>
                  <StyledTableCell>{row.type}</StyledTableCell>
                  <StyledTableCell>{convertDate(row.startDate)}</StyledTableCell>
                  <StyledTableCell>{convertDate(row.endDate)}</StyledTableCell>
                  <StyledTableCell>{row.status}</StyledTableCell>
                  <StyledTableCell>
                    <ButtonGroup size="small" aria-label="small outlined button group">
                      <Button onClick={() => viewDetailsHandler(row._id)}>
                        <ListAltIcon />
                      </Button>
                      <Button onClick={() => setStatus(row._id, 'Прийнято')}>
                        <ThumbUpAltIcon />
                      </Button>
                      <Button onClick={() => setStatus(row._id, 'Відхилено')}>
                        <ThumbUDownAltIcon />
                      </Button>
                    </ButtonGroup>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </>
        : null}
      
      <h1>Мої відпустки</h1>
      {leaves.length ?
        <TableContainer component={Paper} className={classes.table2}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              {headers2.map(header => (
                <StyledTableCell key={header}>{header}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {leaves.map((row) => (
              <StyledTableRow key={row._id}>
                <StyledTableCell>{row.type}</StyledTableCell>
                <StyledTableCell>{convertDate(row.startDate)}</StyledTableCell>
                <StyledTableCell>{convertDate(row.endDate)}</StyledTableCell>
                <StyledTableCell>{row.status}</StyledTableCell>
                <StyledTableCell>
                  <Button onClick={() => viewDetailsHandler(row._id)}>
                    <ListAltIcon />
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> : <p>Немає заявок</p>}
    </div>
  );
}