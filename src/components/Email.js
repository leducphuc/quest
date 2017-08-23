import React, { Component, PropTypes } from 'react';
import Recaptcha from 'react-recaptcha';
import { Button } from 'react-bootstrap';

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const url_api = 'http://599c96b93a19ba0011949cf6.mockapi.io/api/v1';

class Email extends Component {
  constructor(props) {
    super(props);
    this.onClickNext = this.onClickNext.bind(this);
    this.emailValidate = this.emailValidate.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
    this.onloadCallback = this.onloadCallback.bind(this);
    this.state = {
      email: '',
      captchaValid: false,
      errorMessage: [],
      verifiedCaptcha: false,
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.email !== nextState.email) {
      this.setState({ errorMessage: [] });
    }
  }

  onloadCallback() {
    console.log('onloadCallback');
  }

  onClickNext() {
    const { verifiedCaptcha } = this.state;
    const message = this.emailValidate();
    if (message.length !== 0) {
      this.setState({ errorMessage: message }, () => { console.log(message); });
    } else if (verifiedCaptcha) {
      console.log(this.props.fetchApi(`${url_api}/email/${this.state.email}`, { method: 'GET' }));
      this.props.increasePhase();
    }
  }

  emailValidate() {
    const email = this.state.email;
    const message = [];

    if (email.length === 0) {
      message.push('Email con not leave blank');
    } else {
      if (email.length < 8) {
        message.push('Email should not shorter than 8 characters');
      }
      if (!EMAIL_REGEX.test(email)) {
        message.push('Invalid Email');
      }
    }
    return message;
  }

  verifyCallback() {
    this.setState({ verifiedCaptcha: true });
  }

  render() {
    const { errorMessage, email } = this.state;
    return (
      <div className="email_form">
        <input
          type="text" name="site_name"
          value={email}
          onChange={(event) => this.setState({ email: event.target.value.trim() })}
        />

        {errorMessage.length >= 0 &&
          <div className="error_message">
            {errorMessage.map((message, index) =>
              <li key={index}>
                {message}
              </li>
            )}
          </div>
        }

        <Recaptcha
          sitekey="6Le-hy0UAAAAAKSlnMYNxzjOjSC_TxJOUCUi_TmB"
          render="explicit"
          verifyCallback={this.verifyCallback}
          onloadCallback={this.onloadCallback}
        />
        <Button bsStyle="primary" onClick={this.onClickNext}>Next</Button>
      </div>
    );
  }
}

Email.propTypes = {
  increasePhase: PropTypes.func,
  fetchApi: PropTypes.func,
};

export default Email;
