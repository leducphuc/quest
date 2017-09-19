import React, { Component, PropTypes } from 'react';
import AlertContainer from 'react-alert';
import {
  ButtonToolbar,
  Button,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
} from 'react-bootstrap';
import { url_api } from '../constant';

const Loader = require('react-loader');

const alertOptions = {
  offset: 50,
  position: 'top right',
  theme: 'dark',
  time: 5000,
  transition: 'fade',
};

const CODE_REGEX = /^([0-9]{6})/;
class Verify extends Component {
  constructor(props) {
    super(props);
    this.onClickNext = this.onClickNext.bind(this);
    this.codeValidate = this.codeValidate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.state = {
      code: '',
      verifyMethod: '',
      errorMessage: [],
      verifiedCode: false,
    };
  }

  componentWillUpdate(nextProps) {
    if (this.props.error.length < nextProps.error.length) {
      this.setState({ errorMessage: [nextProps.error] });
    }
  }

  onClickNext() {
    const { verifyMethod, code } = this.state;
    const { email } = this.props;
    const message = this.codeValidate();
    if (message.length !== 0) {
      this.setState({ errorMessage: message });
    } else {
      const url = `${url_api}/verifyCode?userId=${email}&method=${verifyMethod}&code=${code}`;
      const response = this.props.fetchApi(url);
      response.then(res => {
        if (!res) {
          this.msg.error('Bad Request');
        } else if (res.result === 'SUCCESS') {
          this.props.increasePhase();
        } else {
          this.setState({ errorMessage: ['wrong_code'] });
        }
      });
    }
  }

  onClickCancel() {
    this.setState({
      code: '',
      verifyMethod: '',
      errorMessage: [],
      verifiedCode: false,
    });
  }

  onChange(field) {
    return event => {
      const value = event.target ? event.target.value : event;
      this.setState({
        [field]: value,
        errorMessage: [],
      });
    };
  }

  handleKeyPress(evt) {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      this.onClickNext();
    }
  }

  codeValidate() {
    const { code, verifyMethod } = this.state;
    const message = [];

    if (code.length === 0) {
      message.push('code_blank');
    } else if (!CODE_REGEX.test(code) || code.length !== 6) {
      message.push('invalid_code');
    }
    if (verifyMethod === '') {
      message.push('verify_method');
    }
    return message;
  }

  render() {
    const errorMessage = this.state.errorMessage;
    return (
      <div className="code_form">
        <AlertContainer ref={a => this.msg = a} {...alertOptions} />
        <div className="row">
          <div className="page-title">
            <h2>Verify your verification code</h2>
          </div>
          <div className="col-md-5 left">
            <div>Please select your selected verification method</div>
            <br />
            <div className="radio">
              <input
                type="radio"
                name="method_radio"
                value="MAIL"
                id="MAIL"
                checked={this.state.verifyMethod === 'MAIL'}
                onChange={this.onChange('verifyMethod')}
              />
              <label htmlFor="MAIL">Email my alternative email</label>
            </div>
            <div className="radio">
              <input
                type="radio"
                name="method_radio"
                value="SMS"
                id="SMS"
                checked={this.state.verifyMethod === 'SMS'}
                onChange={this.onChange('verifyMethod')}
              />
              <label htmlFor="SMS">Text my mobile phone</label>
            </div>
            <div className="radio">
              <input
                type="radio"
                name="method_radio"
                value="CALL"
                id="CALL"
                checked={this.state.verifyMethod === 'CALL'}
                onChange={this.onChange('verifyMethod')}
              />
              <label htmlFor="CALL">Call my mobile phone</label>
            </div>
            {errorMessage.indexOf('verify_method') !== -1 && (
              <div className="error_message">
                <li>Verify method is required</li>
              </div>
            )}
          </div>
          <div className="col-md-5 code-input">
            <Form>
              <FormGroup controlId="formInlineName">
                <div>
                  We have sent you a verification code. Please enter it below{' '}
                </div>
                <FormControl
                  type="text"
                  value={this.state.code}
                  onChange={this.onChange('code')}
                  maxLength={6}
                  onKeyPress={this.handleKeyPress}
                />
              </FormGroup>
            </Form>
            <br />

            {errorMessage.indexOf('code_blank') !== -1 && (
              <div className="error_message">
                <li>This field is required.</li>
              </div>
            )}

            {(errorMessage.indexOf('wrong_code') !== -1 ||
              errorMessage.indexOf('invalid_code') !== -1) && (
              <div className="error_message">
                <li>The code you entered is invalid or it is expired. Please check
                  that you have typed your code correctly or retry to get a new code.
                </li>
              </div>
            )}

            <Loader loaded={this.props.loaded}>
              <div>
                <ButtonToolbar>
                  <Button bsStyle="primary" onClick={this.onClickNext}>
                    Next
                  </Button>

                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={this.onClickCancel}
                  >
                    Cancel
                  </button>
                </ButtonToolbar>
              </div>
            </Loader>
          </div>
        </div>
      </div>
    );
  }
}

Verify.propTypes = {
  increasePhase: PropTypes.func,
  email: PropTypes.string,
  fetchApi: PropTypes.func,
  error: PropTypes.string,
  loaded: PropTypes.bool,
};

export default Verify;
