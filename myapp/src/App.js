import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Login         from "./components/Login";
import {Home}         from './components/Home'

class App extends Component {

  getLogin(LoggedIn){
    this.setState({LoggedIn: LoggedIn})
    console.log(LoggedIn)
  }

  render() {
    return  (
    <Router>
      <div>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/">Home</Link></li>
        </ul>
        <b>Header</b>

        {/* Our router goes here */}
        <Switch>
        <Route exact path="/login" >
          <Login getLogin={this.getLogin.bind(this)} />
        </Route>
        <Route exact path="/" component={Home} />

        </Switch>
        <h3>Footer</h3>
      </div>
    </Router>);
  }
}
export default App;
