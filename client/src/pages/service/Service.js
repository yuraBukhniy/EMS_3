import React, {useEffect, useState} from "react";
import axios from "axios";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";

const useStyles = makeStyles({
  root: {
    marginBottom: 8
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

function viewDetailsHandler(id) {
  window.location = `/service/${id}`
}

export default function ServicePage({admin}) {
  const classes = useStyles();
  const [requests, setRequests] = useState([]);
  const userId = JSON.parse(localStorage.getItem('user')).userId;
  const serverUrl = admin ? `http://localhost:5000/service`
    : `http://localhost:5000/service/user/${userId}`;
  
  useEffect(() => {
    axios.get(serverUrl).then(res => {
      setRequests(res.data)
    })
  }, []);
  
  let pendingRequests = requests.length ? requests.filter(req =>
    req.status === 'У черзі' ||
    req.status === 'В процесі' ||
    req.status === 'Виконано') : [];
  
  let closedRequests = requests.length ? requests.filter(req =>
    req.status === 'Закрито' ||
    req.status === 'Відхилено') : [];
  
  return (
    <div>
      <h1>Технічна підтримка та допомога</h1>
      {!admin ? <Button className={classes.button} variant="contained"
               href="service/new"
      >Новий запит</Button> : null}
      <Grid container spacing={1}>
        <Grid item xs={12} md={5} >
          <h2 align='center'>Запити, що очікують вирішення</h2>
          {pendingRequests.map(request =>
            <Grid key={request._id} item xs={12} >
              <Card key={request._id} className={classes.root}>
                <CardContent>
                  <Typography variant="h6" className={classes.pos}>
                    {request.title}
                  </Typography>
                  <Typography variant="body1">
                    Статус: {request.status}
                  </Typography>
                  {admin ?
                    <Typography variant="body1">
                      Автор: {request.author ? `${request.author.firstName} ${request.author.lastName}` : null}
                    </Typography>
                    : null}
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => viewDetailsHandler(request._id)}>Переглянути</Button>
                </CardActions>
              </Card>
            </Grid>
          )}
        </Grid>
        <Grid item xs={false} md={1} />
        <Grid item xs={12} md={5} >
          <h2 align='center'>Закриті запити</h2>
          {closedRequests.map(request =>
            <Grid key={request._id} item xs={12} >
              <Card key={request._id} className={classes.root}>
                <CardContent>
                  <Typography variant="h6" className={classes.pos}>
                    {request.title}
                  </Typography>
                  <Typography variant="body1">
                    Статус: {request.status}
                  </Typography>
                  {admin ?
                    <Typography variant="body1">
                      Автор: {request.author ? `${request.author.firstName} ${request.author.lastName}` : null}
                    </Typography>
                    : null}
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => viewDetailsHandler(request._id)}>Переглянути</Button>
                </CardActions>
              </Card>
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  );
}