import React from 'react';
import {Switch, Route, Redirect} from "react-router-dom";
import Tasks from "../pages/tasks/Tasks";
import TaskDetails from "../pages/tasks/TaskDetails";
import UserPage from "../pages/EmployeeDetails";
import LeaveMgmtPage from "../pages/leave/Leave";
import NewLeave from "../pages/leave/NewLeave";
import LeaveDetails from "../pages/leave/LeaveDetails";
import EmployeeDetails from "../pages/EmployeeDetails";
import Payment from "../pages/payment/Payment";
import ProjectDetails from "../pages/project/ProjectDetails";
import ServicePage from "../pages/service/Service";
import NewRequest from "../pages/service/NewRequest";
import ServiceDetails from "../pages/service/ServiceDetails";

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
      <Route exact path='/payment' component={Payment} />
      <Route exact path="/project/:id" render={() => <ProjectDetails role='employee' />} />
      <Route exact path="/employee/:id" component={EmployeeDetails} />
      <Route exact path="/service" render={() =>
        <ServicePage admin={false} />}
      />
      <Route exact path="/service/new" component={NewRequest}/>
      <Route exact path="/service/:id" render={(props) =>
        <ServiceDetails id={props.match.params.id} admin={false} />}
      />
      <Redirect to='/' />
    </Switch>
  )
}
