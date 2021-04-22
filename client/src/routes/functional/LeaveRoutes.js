import React from 'react';
import {Switch, Route, Redirect} from "react-router-dom";
import LeaveMgmtPage from "../../pages/leave/Leave";
import NewLeave from "../../pages/leave/NewLeave";
import LeaveDetails from "../../pages/leave/LeaveDetails";

export default function LeaveRoutes({role}) {
  return (
    <Switch>
      <Route exact path='/leave' render={() =>
        <LeaveMgmtPage role={role} />}
      />
      <Route exact path='/leave/new' component={NewLeave} />
      <Route exact path='/leave/:id' render={props =>
        <LeaveDetails id={props.match.params.id} />}
      />
    </Switch>
  )
}