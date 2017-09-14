import React, { Component } from 'react';
import { Grid, Panel } from 'react-bootstrap';
import './App.css';
import logo from './image/ttx_logo.svg';
import Email from './components/Email';
import Verify from './components/Verify';
import ResetPassword from './components/ResetPassword';

const Loader = require('react-loader');

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
      loaded: true,
      error: '',
    };
  }

  setEmail(mail) {
    this.setState({ email: mail });
  }

  increasePhase() {
    this.setState({
      phase: this.state.phase + 1,
    });
  }

  fetchApi(url, request) {
    this.setState({ loaded: false });
    return fetch(url, request).then((response) => {
      this.setState({ loaded: true });
      console.log(response);
      return response.json();
    }).catch((error) => {
      this.setState({ loaded: true });
      console.error(error);
    });
  }

  render() {
    const { phase, error } = this.state;
    return (
      <div className="App" >
        <Loader loaded={this.state.loaded}>
          <Grid>
            <div className="header">
              <Panel className="panel-default">
                <div className="row-fluid user-row">
                  <img src={logo} style={{ width: 100, marginTop: -7 }} role="presentation" />
                </div>
              </Panel>
            </div>
            <div className="body">
              <Panel className="panel-default">
                <div className="web-title">
                  <h3> Get back into your account </h3>
                </div>
                {phase === 0 &&
                  <div className="col-md-6">
                    <Email
                      increasePhase={this.increasePhase}
                      fetchApi={this.fetchApi}
                      setEmail={this.setEmail}
                      error={error}
                    />
                  </div>}
                {phase === 1 &&
                  <Verify
                    increasePhase={this.increasePhase}
                    email={this.state.email}
                    fetchApi={this.fetchApi}
                    error={error}
                  />}
                {phase === 2 &&
                  <ResetPassword
                    increasePhase={this.increasePhase}
                    email={this.state.email}
                    fetchApi={this.fetchApi}
                    error={error}
                  />}
              </Panel>
            </div>
          </Grid>
        </Loader>
      </div>
    );
  }
}

export default App;
