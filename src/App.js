import React, { Component } from 'react';
import { Navbar, Grid, Panel } from 'react-bootstrap';
import './App.css';
import logo from './image/ttx_logo.svg';
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
      phase: 1,
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
      return response.json();
    }).catch((error) => console.error(error));
  }

  render() {
    const { phase } = this.state;
    return (
      <div className="App" >
        <Grid>
          <div className="header">
            <Panel className="panel-default">

              <div className="row-fluid user-row">
                <img src={logo} style={{ width: 100, marginTop: -7 }} />
              </div>
            </Panel>
          </div>
          <div className="body">
            {phase === 0 &&
              <div className="col-md-6">
                <Panel className="panel-default">
                  <h3> Get back into your account </h3>
                  <Email
                    increasePhase={this.increasePhase}
                    fetchApi={this.fetchApi}
                    setEmail={this.setEmail}
                  />
                </Panel>
              </div>}
            {phase === 1 &&
              <Verify
                increasePhase={this.increasePhase}
                email={this.state.email}
                fetchApi={this.fetchApi}
              />}
            {phase === 2 &&
              <ResetPassword
                increasePhase={this.increasePhase}
                email={this.state.email}
                fetchApi={this.fetchApi}
              />}
          </div>
        </Grid>
      </div>
    );
  }
}

export default App;
