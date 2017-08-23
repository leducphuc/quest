import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import './App.css';
import Email from './components/Email';
import Verify from './components/Verify';
import ResetPassword from './components/ResetPassword';

class App extends Component {
  constructor(props) {
    super(props);
    this.increasePhase = this.increasePhase.bind(this);
    this.fetchApi = this.fetchApi.bind(this);
    this.state = {
      phase: 0,
      isFetching: false,
    };
  }

  increasePhase() {
    this.setState({ phase: this.state.phase + 1 });
  }

  fetchApi(url, request) {
    this.setState({ isFetching: true });
    return fetch(url, request).then(response => {
      if (response.status === 404) {
        return 'Not Existed Email';
      }
      return '';
    }).catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
      return 'Network Error';
    });
  }

  render() {
    const { phase } = this.state;
    return (
      <div className="App">

        <div className="header" bsClass="container">
          <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#">TTX</a>
              </Navbar.Brand>
            </Navbar.Header>
          </Navbar>
        </div>

        <div className="body" bsClass="container">
          {phase === 0 &&
            <Email
              increasePhase={this.increasePhase}
              fetchApi={this.fetchApi}
            />}
          {phase === 1 &&
            <Verify
              increasePhase={this.increasePhase}
            />}
          {phase === 2 &&
            <ResetPassword
              increasePhase={this.increasePhase}
            />}
        </div>
      </div>
    );
  }
}

export default App;
