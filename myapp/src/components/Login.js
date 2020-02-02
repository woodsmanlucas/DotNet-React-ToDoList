import React from 'react';
const BASE_URL        = 'https://localhost:44374/api/';

const AUTH_TOKEN = "auth_token"

class Login extends React.Component {

    constructor() {
        super();
        this.state  = {
          loginMessage : "",
          token:"",
          loggedIn: false,
          todos:[]
        };
        this.login         = this.login.bind(this);
    }

    // Called when constructor is finished building component.
    componentDidMount() {
        if(sessionStorage.getItem(AUTH_TOKEN)!=null) {
          this.setState({
            token:sessionStorage.getItem(AUTH_TOKEN)});
        }
    }

    // Executes when button pressed.
    async login(e) {
      const email      = this.email.value;
      const password   = this.password.value;
      const rememberMe = false;

      const URL           = BASE_URL + 'login';
      this.email.value    = ""; // Clear input.
      this.password.value = ""; // Clear input.

      await fetch(URL, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              Email:      email,
              Password:   password,
              RememberMe: rememberMe // Set default to false.
          })
      })
      // Response received.
      .then(response => response.json())
          // Data retrieved.
          .then(json => {
              // Store token with session data.
              if(json["status"]=="OK") {
                sessionStorage.setItem(AUTH_TOKEN, json["token"]);
                this.token   = json["token"];
                console.log(this.token);
                this.setState({loginMessage:"The user has been logged in.",
                token: json["token"] });
                this.setState({loggedIn: true})
                this.props.getLogin(true)
              }
              else {
                this.setState({loginMessage:
                  "An error occured at login. Try again." });
              }
          })
          // Data not retrieved.
          .catch(function (error) {
              if(sessionStorage[""])
              alert(error);
          })
          const token = sessionStorage.getItem("auth_token")
          const response = await fetch('https://localhost:44374/api/login/MyRole', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response.json()
        let bool = false
        data.forEach(element => {
          if(element.roleName === 'Manager' || element.roleName === 'Admin'){
            bool = true
          }
        });
        this.props.getIsManager(bool)
    }
    render() {
        return (
            <div>
            <table>
            <thead>
              <tr>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td> Email: </td>
                <td> <input type='text' ref={(emailInput)=> this.email = emailInput}/> </td>
              </tr>
              <tr>
                <td>Password: </td>
                <td> <input type='password' ref={(passwordInput)=> this.password = passwordInput}/></td>
              </tr>
              <tr><td><button onClick={this.login}>Login</button></td><td></td></tr>
              </tbody>
            </table>
           </div>
        )
    }
}
export default Login;
