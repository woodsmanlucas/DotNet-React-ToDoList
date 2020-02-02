import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import {Redirect} from "react-router";
import Login         from "./components/Login";
import {PleaseLogIn}   from './components/PleaseLogIn'
import ToDo from './components/ToDo'
import {List} from './components/List'
import {Logout} from './components/Logout'

const AUTH_TOKEN = "auth_token"


class App extends Component {
  constructor(){
    super()
    this.state = {
      LoggedIn: false,
      LogOut: false,
      UserIsManager: false
    }
  }

  async componentDidMount() {

}

  getLogin(LoggedIn){
    this.setState({LoggedIn: LoggedIn})
  }

  getBool(Bool){
    this.setState({UserIsManager: Bool})
    console.log(Bool)
  }

  logout(e) {
    if(sessionStorage.getItem("auth_token")!=null) {
        sessionStorage.clear();
    }
    this.setState({LoggedIn: false, LogOut: true});
  }

  render() {
    return  (
    <Router>
     {this.state.LogOut && <Redirect to={{pathname: '/logout'}} />}
     {this.state.LogOut &&  this.setState({LogOut: false})}
      <div>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/">Home</Link></li>
          {this.state.UserIsManager && <Link to="/list">User List</Link>}
          {
            this.state.LoggedIn &&
            <button onClick={this.logout.bind(this)}>Logout</button>
          }
        </ul>

        {/* Our router goes here */}
        <Switch>
        <Route exact path="/login" >
          <Login getLogin={this.getLogin.bind(this)} getIsManager={this.getBool.bind(this)} />
        </Route>
        <Route exact path="/logout" component={Logout} />
        <Route exact path="/list" component={List} />
        <Route exact path="/">
          {this.state.LoggedIn ? <ToDo /> : <><PleaseLogIn /><Login getLogin={this.getLogin.bind(this)} getIsManager={this.getBool.bind(this)}/></>}
        </Route>

        </Switch>
      </div>
    </Router>);
  }
}
export default App;
