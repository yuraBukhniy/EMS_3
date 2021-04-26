import React from 'react';
import {Switch, Route, Redirect} from "react-router-dom";
import Projects from "../pages/project/Projects";
import AddProject from "../pages/project/CreateProject";
import ProjectDetails from "../pages/project/ProjectDetails";
import Employees from "../pages/admin/Employees";
import AddEmployee from "../pages/admin/AddEmployee";
import EmployeeDetails from "../pages/admin/EmployeeDetails";
import ServiceRoutes from "./functional/ServiceRoutes";
import Payment from "../pages/payment/Payment";

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
      <Route exact path="/employees/:id" component={EmployeeDetails} />
      <Route exact path="/payment" render={() =>
        <Payment role='admin' />
      } />
      <ServiceRoutes admin={true} />
      <Redirect to="/" />
    </Switch>
  )
}