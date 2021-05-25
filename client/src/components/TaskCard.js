import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import convertDate from "./ConvertDate";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    //display: 'flex',
    marginBottom: 8
  },
  grid: {
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
});

export default function ({task, cardWidth, handler}) {
  const classes = useStyles()
  return (
    <Grid key={task._id} item xs={12} sm={cardWidth}>
      <Card key={task._id} className={classes.root}>
        <CardContent>
          <Typography variant="h6" className={classes.pos}>
            {task.title}
          </Typography>
          <Typography variant="body1">
            Дедлайн: {convertDate(task.deadline)}
          </Typography>
          <Typography variant="body1">
            Статус: {task.status}
          </Typography>
          {task.endDate ? (
            <Typography variant="body1">
              Виконано: {convertDate(task.endDate)}
            </Typography>
          ) : null}
          <Typography variant="body1">
            {/*Виконавці: {task.assignedTo.join(', ')}*/}
            Виконавці: {task.assignedTo.map(user => user.firstName + " " + user.lastName).join(', ')}
          </Typography>
          {task.status === 'Закрито' ?
            new Date(task.deadline) - new Date(task.endDate) >= 0 ?
              <Typography variant="h6" color='primary'>
                Завдання виконане вчасно
              </Typography>
              :
              <Typography variant="h6" color='secondary'>
                Завдання виконане із запізненням
              </Typography>
            : null}
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handler}>Переглянути</Button>
        </CardActions>
      </Card>
    </Grid>
  )
}