import React, { Component, PropTypes } from 'react';
import {
  Button, Modal, FormGroup, FormControl, Form, ButtonToolbar,
} from 'react-bootstrap';
import { LOWERS, NUMBERS, UPPERS, SPECIAL_CHARACTERS } from '../constant';

const url_api = 'http://10.88.96.158:8084/ttx-help-desk-ver2-SNAPSHOT/service/reset?userId=';
const Loader = require('react-loader');

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.onClickFinish = this.onClickFinish.bind(this);
    this.passwordValidate = this.passwordValidate.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.state = {
      password: '',
      showPasswordConfirm: true,
      showErrorMessage: false,
      confirmPassword: '',
      errorMessage: [],
      success: false,
    };
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
    this.setState({
      errorMessage: error,
    });
  }

  onClickFinish() {
    const { password, confirmPassword, errorMessage, showPasswordConfirm } = this.state;
    if (!showPasswordConfirm) {
      const error = this.passwordValidate('password', password);
      this.setState({ errorMessage: error });
    } else {
      if (confirmPassword === '') {
        const error = this.passwordValidate('confirmPassword', confirmPassword);
        this.setState({ errorMessage: error });
      } else if (errorMessage.length === 0) {
        const url = `${url_api}${this.props.email}&newPassword=${password}`;
        const response = this.props.fetchApi(url, { method: 'GET' });
        response.then((res) => {
          if (res.status === 'SUCCESS') {
            // this.props.increasePhase();
            this.setState({ success: true });
          } else {
            this.setState({ errorMessage: ['Network error'] });
          }
        });
      }
    }
  }

  onClickCancel() {
    this.setState({
      password: '',
      confirmPassword: '',
      errorMessage: [],
      showPasswordConfirm: false,
      success: false,
    });
  }

  passwordValidate(field, value) {
    const message = [];
    if (value.length === 0) {
      message.push('This field is required!');
    } else if (field === 'password') {
      // message.push('The password does not conform to the account password policy:');
      if (value.length < 6) {
        message.push('It must contain at least 6 characters');
        message.push('It must contain an upper case character, a special character and a digit');
      } else {
        let missing = '';
        const head = 'It must contain';
        if (!NUMBERS.test(value)) {
          missing += ' a number';
        }
        if (!UPPERS.test(value)) {
          missing += ' an upper case character';
        }
        if (!LOWERS.test(value)) {
          missing += ' an lower case character';
        }
        if (!SPECIAL_CHARACTERS.test(value)) {
          missing += ' an special character';
        }
        if (missing !== '') {
          message.push(head + missing);
        }
      }
      if (message.length > 0) {
        message.unshift('The password does not conform to the account password policy:');
      }
    } else if (field === 'confirmPassword') {
      if (value !== this.state.password) {
        message.push('Passwords Do not match');
      }
    }
    return message;
  }

  render() {
    const { errorMessage, success, password, confirmPassword,
      showPasswordConfirm } = this.state;
    const validate_state = errorMessage.length === 0 ? null : 'error';
    return (
      <div className="password_form">
        <div className="col-md-4">
          {success &&
            <div className="static-modal">
              <Modal.Dialog>
                <Modal.Header>
                  <Modal.Title>Success</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                  Success! Your password has been updated!
      </Modal.Body>

                <Modal.Footer>
                  <Button onClick={() => window.location.reload()}>Close</Button>
                </Modal.Footer>

              </Modal.Dialog>
            </div>
          }

          <Form>
            <FormGroup validationState={validate_state} >
              <FormControl
                id="password"
                type="password" value={password} placeholder="Password" maxLength="128"
                onChange={this.onChange('password')}
                onBlur={this.onBlur}
              />

              {showPasswordConfirm &&
                <FormControl
                  id="confirmPassword"
                  type="password" value={confirmPassword} placeholder="Password Confirmation"
                  maxLength="128"
                  onChange={this.onChange('confirmPassword')}
                  onBlur={this.onBlur}
                />}
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
          <Loader loaded={this.props.loaded}>
            <ButtonToolbar>
              <Button
                className="btn btn-lg btn-primary btn-sm rspass"
                onClick={this.onClickFinish}
              >
                Finish
            </Button>


              <div
                className="cancel-text"
                onClick={this.onClickCancel}
              >
                Cancel
                </div>
            </ButtonToolbar>
          </Loader>
        </div>
      </div >
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
