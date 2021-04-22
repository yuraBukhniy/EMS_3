import React from 'react';
import {Switch, Route, Redirect} from "react-router-dom";
import Tasks from "../pages/tasks/Tasks";
import TaskDetails from "../pages/tasks/TaskDetails";
import UserPage from "../pages/EmployeeDetails";
import ServiceRoutes from "./functional/ServiceRoutes";
import LeaveMgmtPage from "../pages/leave/Leave";
import NewLeave from "../pages/leave/NewLeave";
import LeaveDetails from "../pages/leave/LeaveDetails";
import EmployeeDetails from "../pages/EmployeeDetails";

export default function EmployeeRoutes() {
  return (
    <Switch>
      <Route exact path="/user" component={EmployeeDetails} />
      <Route exact path="/" render={() =>
        <Tasks role='employee' />}
      />
      <Route exact path="/tasks/:id" render={() =>
        <TaskDetails role='employee' />}
      />
      <Route exact path='/leave' render={() =>
        <LeaveMgmtPage role='employee' />}
      />
      <Route exact path='/leave/new' component={NewLeave} />
      <Route exact path='/leave/:id' component={LeaveDetails} />
      <ServiceRoutes admin={false} />
      <Redirect to='/' />
    </Switch>
  )
}
