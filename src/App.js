import React, { Component } from 'react';
import { Navbar, Grid } from 'react-bootstrap';
import './App.css';
import logo from './logo.svg';
import Email from './components/Email';
import Verify from './components/Verify';
import ResetPassword from './components/ResetPassword';

class App extends Component {
  constructor(props) {
    super(props);
    this.increasePhase = this.increasePhase.bind(this);
    this.fetchApi = this.fetchApi.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.state = {
      phase: 0,
      isFetching: false,
      email: '',
    };
  }

  setEmail(mail) {
    this.setState({ email: mail });
  }

  increasePhase() {
    this.setState({ phase: this.state.phase + 1 });
  }

  fetchApi(url, request) {
    return fetch(url, request).then((response) => {
      return response.ok;
    });
  }

  render() {
    const { phase } = this.state;
    return (
      <div className="App" >
        <Grid>
          <div className="header">
            <Navbar>
              <Navbar.Header>
                <Navbar.Brand>
                  <a href="#">TTX
                    <img src={logo} style={{ width: 100, marginTop: -7 }} />
                  </a>
                </Navbar.Brand>
              </Navbar.Header>
            </Navbar>
          </div>
          <div clasName="body">
            <h1> Get back into your account </h1>
            {phase === 0 &&
              <Email
                increasePhase={this.increasePhase}
                fetchApi={this.fetchApi}
                setEmail={this.setEmail}
              />}
            {phase === 1 &&
              <Verify
                increasePhase={this.increasePhase}
                email={this.state.email}
                fetchApi={this.fetchApi}
              />}
            {phase === 2 &&
              <ResetPassword
                increasePhase={this.increasePhase}
              />}
          </div>
        </Grid>
      </div>
    );
  }
}

export default App;
