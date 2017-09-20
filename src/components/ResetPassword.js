import React, { Component, PropTypes } from 'react';
import {
  Button,
  Modal,
  FormGroup,
  FormControl,
  Form, ButtonToolbar,
} from 'react-bootstrap';
import {
  LOWERS,
  NUMBERS,
  UPPERS,
  SPECIAL_CHARACTERS,
  url_api,
} from '../constant';

const Loader = require('react-loader');

const initial_state = {
  password: '',
  showErrorMessage: false,
  confirmPassword: '',
  errorMessage: [],
  confirmErrorMessage: [],
  passwordErrorMessage: [],
  success: false,
};

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.onClickFinish = this.onClickFinish.bind(this);
    this.passwordValidate = this.passwordValidate.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.state = initial_state;
  }

  componentWillUpdate(nextProps) {
    if (this.props.error.length < nextProps.error.length) {
      this.setState({ errorMessage: [nextProps.error] });
    }
  }

  onChange(field) {
    return event => {
      const value = event.target ? event.target.value.trim() : event;
      const error = this.passwordValidate(field, value);
      this.setState({
        [field]: value,
        errorMessage: error,
      });
    };
  }

  onBlur(evt) {
    const field = evt.target.id;
    const value = evt.target.value;
    const error = this.passwordValidate(field, value);
    const errorField = field === 'password' ? 'passwordErrorMessage' : 'confirmErrorMessage';
    this.setState({
      [errorField]: error,
      errorMessage: error,
    });
  }

  onFocus(evt) {
    this.setState( {
      errorMessage: [],
      confirmErrors: [],
      passwordErrors: [],
    } );
  }

  onClickFinish() {
    const { password, confirmPassword } = this.state;
    const confirmErrors = this.passwordValidate(
      'confirmPassword',
      confirmPassword
    );
    const passwordErrors = this.passwordValidate('password', password);
    const errors = passwordErrors.concat(confirmErrors);

    if (errors.length !== 0) {
      this.setState({ errorMessage: errors });
    }

    if (errors.length === 0) {
      const url = `${url_api}/reset?userId=${this.props
        .email}&newPassword=${password}`;
      const response = this.props.fetchApi(url);
      response.then(res => {
        if (!res) {
          this.msg.error('Bad Request');
        } else if (res.status === 'SUCCESS') {
          this.setState({ success: true });
        }
      });
    }
  }

  onClickCancel() {
    this.setState(initial_state);
  }

  passwordValidate(field, value) {
    const password = this.state.password;
    const message = [];
    const current_field =
      field === 'password' ? 'Password' : 'Password Confirm';
    if (value.length === 0) {
      message.push(`${current_field} field is required!`);
    } else if (field === 'password') {
      if (value.length < 6) {
        message.push('Password must contain at least 6 characters');
        message.push(
          'Password must contain an upper case character, a special character and a digit'
        );
      } else {
        let missing = '';
        let isMissing = false;
        const head = 'Password must contain:';
        if (!NUMBERS.test(value)) {
          missing += ' a number';
          isMissing = true;
        }
        if (!UPPERS.test(value)) {
          const front = isMissing ? ', ' : ' ';
          missing += `${front}an upper case character`;
          isMissing = true;
        }
        if (!LOWERS.test(value)) {
          const front = isMissing ? ', ' : ' ';
          missing += `${front}an lower case character`;
          isMissing = true;
        }
        if (!SPECIAL_CHARACTERS.test(value)) {
          const front = isMissing ? ', ' : ' ';
          missing += `${front}an special character`;
        }
        if (missing !== '') {
          message.push(head + missing);
        }
      }
      if (message.length > 0) {
        message.unshift(
          'The password does not conform to the account password policy:'
        );
      }
    } else if (field === 'confirmPassword') {
      if (value !== password && password.length !== 0) {
        message.push('Passwords do not match');
      }
    }
    return message;
  }

  render() {
    const { errorMessage, success, password, confirmPassword, passwordErrorMessage, confirmErrorMessage } = this.state;
    const passwordValidate = passwordErrorMessage.length === 0 ? null : 'error';
    const confirmValidate = confirmErrorMessage.length === 0 ? null : 'error';
    return (
      <div className="password_form">
        <h2>Choose your new password</h2>
        <h5>Please enter your new password</h5>
        {success && (
          <div className="static-modal">
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>Success</Modal.Title>
              </Modal.Header>

              <Modal.Body>Success! Your password has been updated!</Modal.Body>

              <Modal.Footer>
                <Button onClick={() => window.location.reload()}>Close</Button>
              </Modal.Footer>
            </Modal.Dialog>
          </div>
        )}

        <Form>
          <FormGroup validationState={passwordValidate}>
            <h5> Enter new password: </h5>
            <FormControl
              id="password"
              type="password"
              value={password}
              maxLength="128"
              onChange={this.onChange('password')}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
            />
          </FormGroup>

          <FormGroup validationState={confirmValidate}>
            <h5> Confirm new password: </h5>
            <FormControl
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              maxLength="128"
              onChange={this.onChange('confirmPassword')}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
            />
          </FormGroup>
        </Form>

        {errorMessage.length >= 0 && (
          <div className="error_message">
            <div>{errorMessage[0]}</div>
            {errorMessage.map((message, index) => (
              index > 0 && <li key={index}>{message}</li>
            ))}
          </div>
        )}
        <Loader loaded={this.props.loaded}>
          <ButtonToolbar>
            <Button
              className="btn btn-lg btn-primary btn-sm rspass"
              onClick={this.onClickFinish}
            >
              Finish
            </Button>

            <button
              type="button"
              className="btn btn-link password-cancel"
              onClick={this.onClickCancel}
            >
              Cancel
            </button>
          </ButtonToolbar>
        </Loader>
      </div>
    );
  }
}

ResetPassword.propTypes = {
  increasePhase: PropTypes.func,
  email: PropTypes.string,
  fetchApi: PropTypes.func,
  error: PropTypes.string,
  loaded: PropTypes.bool,
};

export default ResetPassword;
