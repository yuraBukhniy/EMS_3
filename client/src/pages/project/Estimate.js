import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import Modal from '@material-ui/core/Modal';
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import {Alert} from "@material-ui/lab";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {useParams} from 'react-router-dom'
import CircularProgress from "@material-ui/core/CircularProgress";
import {getSalary} from "./EstimateOutput";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {Checkbox, FormControl, Input, ListItemText} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles(theme => ({
  button: {
    marginBottom: 20
  },
  submit: {
    marginTop: 20
  },
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  formControl: {
    marginTop: 20,
    marginBottom: 10,
    width: 300
  },
  select: {
    height: 40,
    width: 170
  },
  inputBlock: {
    marginLeft: 5,
    marginBottom: 5,
    display: 'flex'
  },
  display: {
    display: 'flex',
    flexDirection: 'column'
  },
  noneDisplay: {
    display: 'none'
  },
  width: {
    width: 800
  },
  hideAlert: {
    display: 'none'
  },
  showAlert: {
    display: 'flex',
  },
  cancel: {
    marginLeft: 10
  },
  loader: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    color: '#888888'
  }
}));

export default function () {
  const classes = useStyles();
  const projectId = useParams().id
  const [project, setProject] = useState({})
  const [costs, setCosts] = useState(0)
  const [newBudget, setBudget] = useState(0)
  const [managers, setManagers] = useState({})
  const [leads, setLeads] = useState({})
  const [devs, setDevs] = useState({})
  const [testers, setTesters] = useState({})
  const [designers, setDesigners] = useState({})
  const [analysts, setAnalysts] = useState({})
  const [display, setDisplay] = useState([])
  const [alert, setAlert] = useState({
    show: false,
    severity: 'info',
    message: ''
  })
  
  useEffect(() => {
    axios.get(`http://localhost:5000/project/get/${projectId}`)
      .then(res => {
        setProject(res.data)
      })
    axios.get(`http://localhost:5000/employees/costs/${projectId}`)
      .then(res => {
        setCosts(res.data)
      })
  }, [project, costs]);
  
  const changeDevsHandler = (event, field) => {
    setDevs({
      ...devs,
      [event.target.name]: {
        ...devs[event.target.name],
        [field]: +event.target.value
      }
    })
  }
  
  const changeTestersHandler = (event, field) => {
    setTesters({
      ...testers,
      [event.target.name]: {
        ...testers[event.target.name],
        [field]: +event.target.value
      }
    })
  }
  
  const submitHandler = async () => {
    axios.patch(`http://localhost:5000/project/setestimate/${projectId}`, {costs, currentBudget: project.budget, newBudget, managers, leads, devs, testers, designers, analysts})
      .then(resp => {
        setAlert({
          show: true,
          severity: 'info',
          message: resp.data.message
        })
      })
      .catch(err => {
        setAlert({
          show: true,
          severity: 'error',
          message: err.status
        })
      })
  }
  
  const cancelHandler = () => {
    window.location = `/`;
  }
  
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const categoryChangeHandler = event => {
    setDisplay(event.target.value)
    console.log(event.target.value)
  }
  
  const categories = ['Розробники', 'Тестувальники', 'Аналітики', 'Дизайнери', 'Керівники команди', 'Менеджери']
  const positions = ['trainee', 'junior', 'middle', 'senior', 'lead']
  
  return Object.keys(project).length && costs ? (
    <Container component="main" maxWidth="md">
      <div className={classes.paper}>
        <h1>Планування персоналу проєкту</h1>
        <form noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='body1'>
                Місячний бюджет проєкту: <b>{project.budget || 0} $</b>
              </Typography>
              <Typography variant='body1'>
                Розмір місячних витрат на зарплату працівникам: {costs} $
              </Typography>
              <Typography variant='body1'>
                Витрати на майбутній персонал: {project.estimate ? getSalary(project.estimate) : 0} $
              </Typography>
              <Typography variant='body1'>
                Залишок: {project.budget - costs - (getSalary(project.estimate) || 0)} $
              </Typography>
              <Grid item xs={3}>
                <TextField
                  variant="outlined"
                  size='small'
                  fullWidth
                  label="Введіть місячний бюджет"
                  name="budget"
                  onChange={event => setBudget(+event.target.value)}
                />
              </Grid>
  
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-mutiple-checkbox-label">Виберіть категорії працівників</InputLabel>
                <Select
                  labelId="demo-mutiple-checkbox-label"
                  id="demo-mutiple-checkbox"
                  multiple
                  value={display}
                  onChange={categoryChangeHandler}
                  input={<Input />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>
                      <Checkbox checked={display.indexOf(category) > -1} />
                      <ListItemText primary={category} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
    
            <Grid container spacing={2}>
              <Grid item xs={12} className={classes.width}>
              
              </Grid>
            </Grid>
  
            <Grid container spacing={2} className={display.includes('Розробники') ? classes.display : classes.noneDisplay}>
              <Grid item xs={12}>
                <Typography variant='h5'>Розробники</Typography>
              </Grid>
              <Grid container spacing={2} className={classes.inputBlock}>
                {positions.map(position =>
                  <Grid key={positions.indexOf(position)} item xs={2}>
                    <Typography variant='h6'>{position}</Typography>
          
                    <TextField size='small' label="Кількість" name={position}
                               onChange={event => changeDevsHandler(event, 'amount')}
                    />
                    <TextField size='small' label="Зарплата" name={position}
                               onChange={event => changeDevsHandler(event, 'salary')}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
  
            <Grid container spacing={2} className={display.includes('Тестувальники') ? classes.display : classes.noneDisplay}>
              <Grid item xs={12}>
                <Typography variant='h5'>Тестувальники</Typography>
              </Grid>
              <Grid container spacing={2} className={classes.inputBlock}>
                {positions.map(position =>
                  <Grid key={positions.indexOf(position)} item xs={2}>
                    <Typography variant='h6'>{position}</Typography>
          
                    <TextField size='small' label="Кількість" name={position}
                               onChange={event => changeTestersHandler(event, 'amount')}
                    />
                    <TextField size='small' label="Зарплата" name={position}
                               onChange={event => changeTestersHandler(event, 'salary')}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
  
            <Grid item xs={4} className={display.includes('Аналітики') ? classes.display : classes.noneDisplay}>
              <Typography variant='h5'>Аналітики</Typography>
              <Grid item xs={6}>
                <TextField size='small' label="Кількість" name="amount"
                           onChange={event => setAnalysts({
                             ...analysts,
                             amount: +event.target.value
                           })}
                />
                <TextField size='small' label="Зарплата" name="salary"
                           onChange={event => setAnalysts({
                             ...analysts,
                             salary: +event.target.value
                           })}
                />
              </Grid>
            </Grid>
            <Grid item xs={4} className={display.includes('Дизайнери') ? classes.display : classes.noneDisplay}>
              <Typography variant='h5'>Дизайнери</Typography>
              <Grid item xs={6}>
                <TextField size='small' label="Кількість" name="amount"
                           onChange={event => setDesigners({
                             ...designers,
                             amount: +event.target.value
                           })}
                />
                <TextField size='small' label="Зарплата" name="salary"
                           onChange={event => setDesigners({
                             ...designers,
                             salary: +event.target.value
                           })}
                />
              </Grid>
            </Grid>
            <Grid item xs={4} className={display.includes('Менеджери') ? classes.display : classes.noneDisplay}>
              <Typography variant='h5'>Менеджери</Typography>
              <Grid item xs={6}>
                <TextField size='small' label="Кількість" name="amount"
                           onChange={event => setManagers({
                             ...managers,
                             amount: +event.target.value
                           })}
                />
                <TextField size='small' label="Зарплата" name="salary"
                           onChange={event => setManagers({
                             ...managers,
                             salary: +event.target.value
                           })}
                />
              </Grid>
            </Grid>
  
            <Grid item xs={12}>
              <Alert
                severity={alert.severity}
                className={alert.show ? classes.showAlert : classes.hideAlert}
              >
                {alert.message}
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={submitHandler}
              >
                Зберегти
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
            
          </Grid>
        </form>
      </div>
    </Container>
  ) : <CircularProgress size={100} className={classes.loader} />
}