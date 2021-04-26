import React from 'react';
import {Switch, Route, Redirect} from "react-router-dom";
import Team from "../pages/Team";
import Tasks from "../pages/tasks/Tasks";
import NewTask from "../pages/tasks/NewTask";
import TaskDetails from "../pages/tasks/TaskDetails";
import LeaveMgmtPage from "../pages/leave/Leave";
import ServiceRoutes from "./functional/ServiceRoutes";
import NewLeave from "../pages/leave/NewLeave";
import LeaveDetails from "../pages/leave/LeaveDetails";
import EmployeeDetails from "../pages/EmployeeDetails";
import Payment from "../pages/payment/Payment";

export default function LeadRoutes() {
  return (
    <Switch>
      <Route exact path="/" component={Team} />
      <Route exact path="/tasks" render={() =>
        <Tasks role='teamLead' />}
      />
      <Route exact path="/tasks/new" component={NewTask} />
      <Route exact path="/tasks/:id" render={() =>
        <TaskDetails role='teamLead' />}
      />
      <Route exact path='/leave' render={() =>
        <LeaveMgmtPage role='teamLead' />}
      />
      <Route exact path='/leave/new' component={NewLeave} />
      <Route exact path='/leave/:id' render={() =>
        <LeaveDetails lead={true} />}
      />
      <Route exact path='/payment' component={Payment} />
      <ServiceRoutes admin={false} />
        <Route exact path="/user" component={EmployeeDetails} />
        <Route exact path="/:id" component={EmployeeDetails} />
      <Redirect to='/' />
    </Switch>
  )
}
