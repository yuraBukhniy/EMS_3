import React from 'react';
import {Switch, Route, Redirect} from "react-router-dom";

import Projects from "../pages/project/Projects";
import CandidatesPage from '../pages/hr/Candidates';
import CandidateDetails from '../pages/hr/CandDetails';
import NewCandidate from "../pages/hr/NewCandidate"
import ProjectDetails from "../pages/project/ProjectDetails";
import Payment from "../pages/payment/Payment";
import LeaveMgmtPage from "../pages/leave/Leave";
import NewLeave from "../pages/leave/NewLeave";
import LeaveDetails from "../pages/leave/LeaveDetails";
import EmployeeDetails from "../pages/EmployeeDetails";

let role = JSON.parse(localStorage.getItem('user'))
if(role) {
  role = role.position.includes('Manager') ? 'teamLead' : 'employee'
}

export default function HRRoutes() {
  return (
    <Switch>
      <Route exact path="/" render={() => <Projects role='HR' />} />
      <Route exact path="/project/:id" render={(props) =>
        <ProjectDetails role='HR' id={props.match.params.id} />
      } />
      <Route exact path="/candidates" component={CandidatesPage} />
      <Route exact path="/candidates/new" component={NewCandidate} />
      <Route exact path="/candidates/:id" component={CandidateDetails} />
      <Route exact path="/employee/:id" component={EmployeeDetails} />
      <Route exact path='/leave' render={() =>
        <LeaveMgmtPage role={role} />}
      />
      <Route exact path='/leave/new' component={NewLeave} />
      <Route exact path='/leave/:id' render={() =>
        <LeaveDetails lead={role === 'teamLead'} />}
      />
      <Route exact path='/payment' component={Payment} />
      <Route exact path="/user" component={EmployeeDetails} />
      <Redirect to='/' />
    </Switch>
  )
}