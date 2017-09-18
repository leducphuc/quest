import React, { Component } from 'react';
import { Grid, Panel } from 'react-bootstrap';
import 'isomorphic-fetch';
import './App.css';
import Email from './components/Email';
import Verify from './components/Verify';
import ResetPassword from './components/ResetPassword';
import logo from './image/logo-ttx.png';

class App extends Component {
  constructor(props) {
    super(props);
    this.increasePhase = this.increasePhase.bind(this);
    this.fetchApi = this.fetchApi.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.state = {
      phase: 1,
      email: '',
      loaded: true,
      error: '',
    };
  }

  setEmail(mail) {
    this.setState({ email: mail });
  }

  increasePhase() {
    this.setState({ phase: this.state.phase + 1 });
  }

  fetchApi(url) {
    this.setState({ loaded: false });
    return fetch(url)
      .then((response) => {
        this.setState({ loaded: true });
        return response.json();
      }).then((json) => {
        return json;
      })
      .catch((error) => {
        this.setState({ loaded: true });
        console.error(error);
      });
  }

  render() {
    const { phase, error, loaded } = this.state;
    const col = phase === 1 ? 'col-md-8' : 'col-md-6';
    return (
      <div className="App">
        <Grid>
          <div className="header">
            <Panel className="panel-default">
              <div className="row-fluid user-row">
                <div className="logo-header">
                  <img
                    id="headerImage"
                    title="TTX"
                    className="logo"
                    src={logo}
                    alt="TTX"
                    onClick={() => window.location.reload()}
                  />
                </div>
              </div>
            </Panel>
          </div>
          <div className="body">
            <Panel>
              <div className="web-title">
                <h1> Get back into your account </h1>
              </div>
              {phase === 0 && (
                <div className={col}>
                  <Email
                    increasePhase={this.increasePhase}
                    fetchApi={this.fetchApi}
                    setEmail={this.setEmail}
                    error={error}
                    loaded={loaded}
                  />
                </div>
              )}
              {phase === 1 && (
                <Verify
                  increasePhase={this.increasePhase}
                  email={this.state.email}
                  fetchApi={this.fetchApi}
                  error={error}
                  loaded={loaded}
                />
              )}
              {phase === 2 && (
                <div className={col}>
                  <ResetPassword
                    increasePhase={this.increasePhase}
                    email={this.state.email}
                    fetchApi={this.fetchApi}
                    error={error}
                    loaded={loaded}
                  />
                </div>
              )}
            </Panel>
          </div>
        </Grid>
      </div>
    );
  }
}

export default App;
