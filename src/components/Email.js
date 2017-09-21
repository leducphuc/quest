import React, { Component, PropTypes } from 'react';
import Recaptcha from 'react-recaptcha';
import AlertContainer from 'react-alert';
import { Button, FormGroup, FormControl, Form, ButtonToolbar } from 'react-bootstrap';
import { url_api } from '../constant';

const Loader = require('react-loader');

const EMAIL_REGEX = /^[-a-zA-Z0-9:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
const alertOptions = {
  offset: (50, 50),
  position: 'top right',
  theme: 'dark',
  time: 5000,
  transition: 'fade',
};

class Email extends Component {
  constructor(props) {
    super(props);
    this.onClickNext = this.onClickNext.bind(this);
    this.emailValidate = this.emailValidate.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
    this.onloadCallback = this.onloadCallback.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.state = {
      email: '',
      errorMessage: [],
      captchaEror: false,
      verifiedCaptcha: false,
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.email !== nextState.email) {
      this.setState({ errorMessage: [] });
    }
    if (this.props.error.length < nextProps.error.length) {
      this.setState({ errorMessage: [nextProps.error] });
    }
  }

  onloadCallback() {
    console.log('onloadCallback');
  }

  onClickNext() {
    const { verifiedCaptcha } = this.state;
    const message = this.emailValidate();
    if (message.length !== 0) {
      if (message.indexOf('missing_captcha') !== -1) {
        message.splice(0, 1);
        this.setState({ captchaEror: true });
      }
      this.setState({ errorMessage: message });
    } else if (verifiedCaptcha) {
      const response = this.props.fetchApi(`${url_api}/checkUser?userId=${this.state.email}`);

      response.then(res => {
        if (!res) {
          this.msg.error('Bad Request');
        } else if (res.status === 'true') {
          this.props.increasePhase();
          this.props.setEmail(this.state.email);
        } else {
          this.setState({ errorMessage: ['The user ID you entered does not exist. Please check that you have typed your user ID correctly.'] });
        }
      });
    }
  }

  onClickCancel() {
    this.setState({
      email: '',
      errorMessage: [],
    });
  }

  handleKeyPress(evt) {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      this.onClickNext();
    }
  }

  emailValidate() {
    const { email, verifiedCaptcha } = this.state;
    const message = [];

    if (!verifiedCaptcha) {
      message.push('missing_captcha');
    }
    if (email.length === 0) {
      message.push('User ID is required.');
    } else if (email.length < 6) {
      message.push('User ID must contain at least 6 characters');
    } else if (!EMAIL_REGEX.test(email)) {
      message.push('Please type your User ID in the format user.ttx.');
    }
    return message;
  }

  verifyCallback() {
    this.setState({ verifiedCaptcha: true });
  }

  render() {
    const { errorMessage, email } = this.state;
    const validate_state = errorMessage.length === 0 ? null : 'error';
    return (
      <div className="email_form">
        <AlertContainer ref={a => this.msg = a} {...alertOptions} />
        <div className="page-title">
          <h2> Who are you ? </h2>
          <h5> To recover your account, begin by entering your user ID and the captcha below. </h5>
        </div>
        <div className="email-input">
          <Form>
            <FormGroup validationState={validate_state} >
              <h5>User ID: </h5>
              <FormControl
                id="userId"
                type="text" value={email}
                maxLength="30"
                onChange={(event) => this.setState({ email: event.target.value.trim() })}
                onKeyPress={this.handleKeyPress}
              />
            </FormGroup>
          </Form>
          <div className="example-email">
            <h6>Example: user.ttx</h6>
          </div>

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

          {
            this.state.captchaEror &&
            <div className="error_message">
              Captcha is required.
            </div>
          }

          <Loader loaded={this.props.loaded}>
            <div className="email-button">
              <ButtonToolbar>
                <Button bsStyle="primary" onClick={this.onClickNext}>
                  Next
               </Button>

                <button type="button" className="btn btn-link " onClick={this.onClickCancel}>Cancel</button>
              </ButtonToolbar>
            </div>
          </Loader>
        </div>
      </div >
    );
  }
}

Email.propTypes = {
  increasePhase: PropTypes.func,
  fetchApi: PropTypes.func,
  setEmail: PropTypes.func,
  error: PropTypes.string,
  loaded: PropTypes.bool,
};

export default Email;
