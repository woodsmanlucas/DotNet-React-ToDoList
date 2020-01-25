import React from 'react';
const BASE_URL        = 'https://localhost:44374/api/';

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3b29kc21hbi5sdWNhc0BnbWFpbC5jb20iLCJqdGkiOiJjYTQ3NmIyMy0zYWU0LTRlMjMtYjQ5Zi00YjNkOTVkNGM5MjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImQyN2E5ZmI0LWFkZTQtNGYxZC1iMjFlLTE1YmRlNGQxYTViZSIsImV4cCI6MTU3OTk0MzE1MywiaXNzIjoiVGVzdC5jb20iLCJhdWQiOiJUZXN0LmNvbSJ9.udKesYy_tIP2mccIFxGKSnICSAp6sHWNUDJuvMdXy3o";

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
        this.logout        = this.logout.bind(this);
        this.getSecureData = this.getSecureData.bind(this);
    }

    // Called when constructor is finished building component.
    componentDidMount() {
        if(sessionStorage.getItem(AUTH_TOKEN)!=null) {
          this.setState({
            token:sessionStorage.getItem(AUTH_TOKEN)});
        }
    }

    // Executes when button pressed.
    login(e) {
      const email      = this.email.value;
      const password   = this.password.value;
      const rememberMe = false;

      const URL           = BASE_URL + 'login';
      this.email.value    = ""; // Clear input.
      this.password.value = ""; // Clear input.

      fetch(URL, {
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
    }

    logout(e) {
      if(sessionStorage.getItem([AUTH_TOKEN])!=null) {
          sessionStorage.clear();
      }
      this.setState({todos:[], loginMessage : "", token:"", loggedIn: false});
    }

    getSecureData(e) {
      let token   = sessionStorage.getItem('auth_token');


      const URL        = BASE_URL + 'Login/List';

        // This code gets data from the remote server.
        // fetch(URL).then(response => response.json())
        fetch(URL, {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      })
      .then(res => res.json())
      // Data Retrieved.
      .then((data) => {
          alert(JSON.stringify(data))
          this.setState({todos:data });
      })

        // Data Not Retrieved.
        .catch((error) => {
            alert(error);
        });

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
                <td> <input type='text' ref={(passwordInput)=> this.password = passwordInput}/></td>
              </tr>
              <tr><td><button onClick={this.login}>Login</button></td><td></td></tr>
              </tbody>
            </table>
            {this.state.loginMessage}<br/>{this.state.token}<br/><br/>

            <button onClick={this.getSecureData}>Get Secure Data</button>
            <ul>
              {this.state.todos.map((item, index)=>(
                <li key={item}>{index} {item} {item.description}</li>
              ))}
            </ul>
            <br/>
            {
              this.state.loggedIn &&
            <button onClick={this.logout}>Logout</button>
            }
            </div>
        )
    }
}
export default Login;