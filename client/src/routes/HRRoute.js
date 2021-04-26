import React from 'react';
import {Switch, Route, Redirect} from "react-router-dom";

import Projects from "../pages/project/Projects";
import CandidatesPage from '../pages/hr/Candidates';
import CandidateDetails from '../pages/hr/CandDetails';
import EmployeesPage from "../pages/Employees";
import NewCandidate from "../pages/hr/NewCandidate"
import ProjectDetails from "../pages/project/ProjectDetails";
import LeaveRoutes from "./functional/LeaveRoutes";
import UserPage from "../pages/EmployeeDetails";
import Payment from "../pages/payment/Payment";

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
      <Route exact path="/employees" component={EmployeesPage} />
      <Route exact path='/payment' component={Payment} />
      <Route exact path="/user" component={UserPage} />
      <LeaveRoutes role='HR' />
      <Redirect to='/' />
    </Switch>
  )
}