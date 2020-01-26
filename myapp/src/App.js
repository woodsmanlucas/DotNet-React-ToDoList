import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Login         from "./components/Login";
import {Home}         from './components/Home'

class App extends Component {
  render() {
    return  (
    <Router>
      <div>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/">Home</Link></li>
        </ul>

        {/* Our router goes here */}
        <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/" component={Home} />

        </Switch>
      </div>
    </Router>);
  }
}
export default App;
