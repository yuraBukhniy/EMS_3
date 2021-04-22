import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import axios from "axios";

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
});

const viewDetailsHandler = (id) => {
  window.location = `/employee/${id}`
}

export default function () {
  const classes = useStyles();
  const [employees, setEmployees] = useState([]);
  
  useEffect(() => {
    axios.get('http://localhost:5000/employees')
      .then(res => {
        setEmployees(res.data)
      })
  }, []);
  
  return (
    <>
      <h1>Працівники</h1>
      <Button className={classes.button} variant="contained"
              href="employees/new"
      >Додати працівника</Button>
      <Grid container spacing={1} className={classes.grid}>
      {employees.map(employee => (
        <Grid key={employee._id} item xs={12} md={6} >
          <Card key={employee._id} className={classes.root}>
            <Avatar className={classes.avatar} />
            <CardContent>
              <Typography variant="h6">
                {employee.firstName + " " + employee.lastName}
              </Typography>
              <Typography variant="body2" component="p">
                {employee.seniority + " " + employee.position}
              </Typography>
              <Typography variant="body2" component="p">
                {employee.project.name}
              </Typography>
            </CardContent>
            <CardActions>
              {/*<Button size="small" onClick={() => viewDetailsHandler(employee._id)}>View Details</Button>*/}
              {/*<Button size="small" onClick={() => setOpenModal(true)}>Edit</Button>*/}
            </CardActions>
          </Card>
        </Grid>
      ))}
      </Grid>
    </>
  )
}