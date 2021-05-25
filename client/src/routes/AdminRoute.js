import React from 'react';
import {Switch, Route, Redirect} from "react-router-dom";
import Projects from "../pages/project/Projects";
import AddProject from "../pages/project/CreateProject";
import ProjectDetails from "../pages/project/ProjectDetails";
import Employees from "../pages/admin/Employees";
import AddEmployee from "../pages/admin/AddEmployee";
import EmployeeDetails from "../pages/EmployeeDetails";
import Payment from "../pages/payment/Payment";
import LeaveMgmtPage from "../pages/leave/Leave";
import NewLeave from "../pages/leave/NewLeave";
import LeaveDetails from "../pages/leave/LeaveDetails";
import ServicePage from "../pages/service/Service";
import NewRequest from "../pages/service/NewRequest";
import ServiceDetails from "../pages/service/ServiceDetails";

let role = JSON.parse(localStorage.getItem('user'))
if(role) {
  role = role.position.includes('Manager') ? 'teamLead' : 'employee'
}

export default function AdminRoute() {
  return (
    <Switch>
      <Route exact path="/" render={() => <Projects role='admin' />} />
      <Route exact path="/projects/new" component={AddProject} />
      <Route exact path="/project/:id" render={(props) =>
        <ProjectDetails role='admin' id={props.match.params.id} />
      } />
      <Route exact path="/employees" component={Employees} />
      <Route exact path="/employees/new" component={AddEmployee} />
      <Route exact path="/employee/:id" component={EmployeeDetails} />
      <Route exact path="/payment" render={() =>
        <Payment role='admin' />
      } />
      <Route exact path='/leave' render={() =>
        <LeaveMgmtPage role={role} />}
      />
      <Route exact path='/leave/new' component={NewLeave} />
      <Route exact path='/leave/:id' render={() =>
        <LeaveDetails lead={role === 'teamLead'} />}
      />
      <Route exact path="/user" component={EmployeeDetails} />
      <Route exact path="/service" render={() =>
        <ServicePage admin />}
      />
      <Route exact path="/service/:id" render={(props) =>
        <ServiceDetails id={props.match.params.id} admin />}
      />
      <Redirect to="/" />
    </Switch>
  )
}