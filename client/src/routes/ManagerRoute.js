import React from 'react';
import {Switch, Route, Redirect} from "react-router-dom";
import EditProject from "../pages/project/EditProject";
import ProjectDetails from "../pages/project/ProjectDetails";
import Estimate from "../pages/project/Estimate";
import Tasks from "../pages/tasks/Tasks";
import NewTask from "../pages/tasks/NewTask";
import TaskDetails from "../pages/tasks/TaskDetails";
import Team from "../pages/Team";
import EmployeeDetails from "../pages/EmployeeDetails";
import LeaveMgmtPage from "../pages/leave/Leave";
import NewLeave from "../pages/leave/NewLeave";
import LeaveDetails from "../pages/leave/LeaveDetails";
import Payment from "../pages/payment/Payment";
import ServicePage from "../pages/service/Service";
import NewRequest from "../pages/service/NewRequest";
import ServiceDetails from "../pages/service/ServiceDetails";

export default function ManagerRoute() {
  return (
    <Switch>
      <Route exact path="/" render={() => <ProjectDetails role='manager' />} />
      <Route exact path="/project/estimate/:id" component={Estimate} />
      <Route exact path="/user" component={EmployeeDetails} />
      
      <Route exact path="/team" render={() => <Team manager={true} />} />
      <Route exact path="/employee/:id" component={EmployeeDetails} />
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
      <Route exact path='/leave/:id' render={() =>
        <LeaveDetails lead={true} />}
      />
      <Route exact path='/payment' component={Payment} />
      <Route exact path="/service" render={() =>
        <ServicePage admin={false} />}
      />
      <Route exact path="/service/new" component={NewRequest}/>
      <Route exact path="/service/:id" render={(props) =>
        <ServiceDetails id={props.match.params.id} admin={false} />}
      />
      <Redirect to="/" />
    </Switch>
  )
}