import React from 'react';
import {Switch, Route, Redirect} from "react-router-dom";
//import Projects from "../pages/project/Projects";
import EditProject from "../pages/project/EditProject";
import ProjectDetails from "../pages/project/ProjectDetails";
//import Employees from "../pages/admin/Employees";
//import AddEmployee from "../pages/admin/AddEmployee";
//import EmployeeDetails from "../pages/admin/EmployeeDetails";
import ServiceRoutes from "./functional/ServiceRoutes";
import Tasks from "../pages/tasks/Tasks";
import NewTask from "../pages/tasks/NewTask";
import TaskDetails from "../pages/tasks/TaskDetails";
import Team from "../pages/Team";
import EmployeeDetails from "../pages/EmployeeDetails";
import LeaveMgmtPage from "../pages/leave/Leave";
import NewLeave from "../pages/leave/NewLeave";
import LeaveDetails from "../pages/leave/LeaveDetails";

export default function ManagerRoute() {
  return (
    <Switch>
      <Route exact path="/" render={() => <ProjectDetails role='manager' />} />
      <Route exact path="/user" component={EmployeeDetails} />
      
      <Route exact path="/team" render={() => <Team manager={true} />} />
      <Route exact path="/team/:id" component={EmployeeDetails} />
      <Route exact path="/tasks" render={() =>
        <Tasks role='manager' />}
      />
      <Route exact path="/tasks/new" component={NewTask} />
      <Route exact path="/tasks/:id" render={() =>
        <TaskDetails role='manager' />}
      />
      <Route exact path="/project/edit" component={EditProject} />
      <Route exact path='/leave' render={() =>
        <LeaveMgmtPage role='teamLead' />}
      />
      <Route exact path='/leave/new' component={NewLeave} />
      <Route exact path='/leave/:id' component={LeaveDetails} />
      
      {/*<Route exact path="/employees" component={Employees} />*/}
      {/*<Route exact path="/employees/:id" component={EmployeeDetails} />*/}
      <ServiceRoutes admin={false} />
      <Redirect to="/" />
    </Switch>
  )
}