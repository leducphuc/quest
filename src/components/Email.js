import React, { Component, PropTypes } from 'react';
import Recaptcha from 'react-recaptcha';
import { Button, FormGroup, FormControl, ControlLabel, Form, Panel } from 'react-bootstrap';

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
      const response = this.props.fetchApi(`${url_api}/email/${this.state.email}`, { method: 'GET' });
      response.then((res) => {
        if (res) {
          this.props.setEmail(this.state.email);
          this.props.increasePhase();
        } else {
          this.setState({ errorMessage: ['Email Not Exitsed'] });
        }
      });
    }
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
        <div className="row vertical-offset-100">
          <div className="col-md-4 col-md-offset-4">
            <Panel className="panel-default">
              <h2> Who are you ? </h2>
              <h5> To recover your account, begin entering your user ID and the captcha </h5>
              <div className="panel-body">
                <Form>
                  <FormGroup validationState={validate_state} >
                    <FormControl placeholder="User ID" type="text" value={email} maxLength="30" onChange={(event) => this.setState({ email: event.target.value.trim() })} />
                  </FormGroup>
                </Form>
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
                <Button className="btn btn-lg btn-success btn-block" onClick={this.onClickNext}>
                  Next >>
                 </Button>
              </div>
            </Panel>
          </div>
        </div>
      </div >
    );
  }
}

Email.propTypes = {
  increasePhase: PropTypes.func,
  fetchApi: PropTypes.func,
  setEmail: PropTypes.func,
};

export default Email;
