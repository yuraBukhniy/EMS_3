import React from "react";
import {Switch, Route, BrowserRouter as Router, Redirect} from 'react-router-dom';
import Login from './pages/Login';
import Navbar from './Navbar';

function App() {
  const isAuthenticated = JSON.parse(localStorage.getItem('user'));
  
  return (
    <Router>
      <Switch>
        <Route path='/login' component={Login} exact/>
        {!!isAuthenticated ? (
          <Navbar role={isAuthenticated.role} />
        ) : (
          <Redirect to='/login'/>
        )}
        <Redirect to='/'/>
      </Switch>
    </Router>
  );
  /*return (
    <Router>
      <Switch>
        <Route path='/register' component={Register} exact/>
        <Route path='/login' component={Login} exact/>
        {isAuthenticated ? (
          <>
            <Navbar />
            <div style={{ display: "flex" }}>
              <Sidebar />
              <Route exact path='/' component={ProjectOverview} />
              <Route exact path='/user' component={UserPage} />
              <Route exact path='/leave' component={LeaveMgmtPage} />
              <Route exact path='/service' component={ServicePage} />
            </div>
          </>
        ) : (
          <Redirect to='/login'/>
        )}
  
        <Redirect to='/'/>
      </Switch>
    </Router>
  );*/
}

export default App;
