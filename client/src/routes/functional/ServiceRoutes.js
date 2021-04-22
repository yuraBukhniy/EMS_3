import React from 'react';
import {Switch, Route, Redirect} from "react-router-dom";
import ServicePage from "../../pages/service/Service";
import NewRequest from "../../pages/service/NewRequest";
import ServiceDetails from "../../pages/service/ServiceDetails";

export default function ServiceRoutes({admin}) {
  return (
    <Switch>
      <Route exact path="/service" render={() =>
        <ServicePage admin={admin} />}
      />
      {!admin ? <Route exact path="/service/new" component={NewRequest}/> : null}
      <Route exact path="/service/:id" render={(props) =>
        <ServiceDetails id={props.match.params.id} admin={admin} />}
      />
      {/*<Redirect to='/services' />*/}
    </Switch>
  )
}