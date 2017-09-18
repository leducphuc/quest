import React, { Component, PropTypes } from 'react';
import Recaptcha from 'react-recaptcha';
import { Button, FormGroup, FormControl, Form, ButtonToolbar } from 'react-bootstrap';
import { url_api } from '../constant';

const Loader = require('react-loader');

const EMAIL_REGEX = /^[-a-zA-Z0-9:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
class Email extends Component {
  constructor(props) {
    super(props);
    this.onClickNext = this.onClickNext.bind(this);
    this.emailValidate = this.emailValidate.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
    this.onloadCallback = this.onloadCallback.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
    this.state = {
      email: '',
      errorMessage: [],
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
      this.setState({ errorMessage: message });
    } else if (verifiedCaptcha) {
      const response = this.props.fetchApi(`${url_api}/checkUser?userId=${this.state.email}`);

      response.then(res => {
        if (!res) {
          this.setState({ errorMessage: 'Bad Request' });
        } else if (res.status === 'true') {
          this.props.increasePhase();
        } else {
          this.setState({ errorMessage: ['UserID Not Exitsed'] });
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

  emailValidate() {
    const { email, verifiedCaptcha } = this.state;
    const message = [];

    if (!verifiedCaptcha) {
      message.push('Captcha has not been completed');
    }
    if (email.length === 0) {
      message.push('Email can not leave blank');
    } else if (email.length < 6 || !EMAIL_REGEX.test(email)) {
      message.push('Invalid Email');
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

        <h2> Who are you ? </h2>
        <h5> To recover your account, begin entering your user ID and the captcha </h5>
        <div>
          <Form>
            <FormGroup validationState={validate_state} >
              <FormControl
                id="userId"
                placeholder="User ID"
                type="text" value={email}
                maxLength="30"
                onChange={(event) => this.setState({ email: event.target.value.trim() })}
              />
            </FormGroup>
          </Form>
          <div className="example-email">
            <h5>Example: user.ttx</h5>
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
          <Loader loaded={this.props.loaded}>
            <div className="email-button">
              <ButtonToolbar>
                <Button bsStyle="primary" onClick={this.onClickNext}>
                  Next
               </Button>
                {email.length !== 0 &&
                  <Button bsStyle="default" onClick={this.onClickCancel}>
                    Cancel
                </Button>
                }
                {
                  email.length === 0 &&
                  <button type="button" className="btn btn-link email-cancel" onClick={this.onClickCancel}>Cancel</button>
                }
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
