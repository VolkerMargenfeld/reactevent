// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, useHistory, matchPath } from 'react-router-dom';
import { Container } from 'reactstrap';
import withAuthProvider, { AuthComponentProps } from './AuthProvider';
import NavBar from './NavBar';
import ErrorMessage from './ErrorMessage';
import Welcome from './Welcome';
import Calendar from './Calendar';
import Eventdetail from './Eventdetail';
import 'bootstrap/dist/css/bootstrap.css';



class App extends Component<AuthComponentProps> {
  

  render() {
    let error = null;
    console.log("App props" + JSON.stringify(this.props));
    if (this.props.error) {
      error = <ErrorMessage
        message={this.props.error.message}
        debug={this.props.error.debug} />;
    }

    // <renderSnippet>
    return (
      <Router>
        
        <div>
          <NavBar
            isAuthenticated={this.props.isAuthenticated}
            authButtonMethod={this.props.isAuthenticated ? this.props.logout : this.props.login}
            user={this.props.user}/>
          <Container>
            {error}
            <Route exact path="/"
            
              render={(props) =>
                <Welcome {...props}
                  isAuthenticated={this.props.isAuthenticated}
                  user={this.props.user}
                  authButtonMethod={this.props.login} />
              } />
              
            <Route exact path="/calendar"
              render={(props) =>
                this.props.isAuthenticated ?
                  <Calendar {...props} /> :
                  <Redirect to="/" />
              } />
          </Container>
          <Container>
          
          <Route path="/calendar/:id"
          
          
          render={(props) =>
                this.props.isAuthenticated && true ?
                  <Eventdetail {...props} /> :
                  <Redirect to="/" />
              } />
              
          </Container>
        </div>
        
      </Router>
    );
    // </renderSnippet>
  }
}


export default withAuthProvider(App);

/*
<div>
          <!--
        {JSON.stringify(this.props)}
        {"state:"+JSON.stringify(this.state)}
        -->
</div>
        */