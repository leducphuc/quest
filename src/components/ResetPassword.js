import React, { Component, PropTypes } from 'react';
import Recaptcha from 'react-recaptcha';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.onClickFinish = this.onClickFinish.bind(this);
    this.passwordValidate = this.passwordValidate.bind(this);
    this.state = {
      password: '',
      confirmPassword: '',
      errorMessage: [],
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.password !== nextState.password ||
      this.state.confirmPassword !== nextState.confirmPassword) {
      this.setState({ errorMessage: [] });
    }
  }

  onClickFinish() {
    console.log(this.state.password);
    const message = this.passwordValidate();
    if (message.length !== 0) {
      this.setState({ errorMessage: message }, () => { console.log(message); });
    }
    console.log('finished');
  }

  onClickCancel() {
    this.setState = {
      password: '',
      confirmPassword: '',
    };
  }

  passwordValidate() {
    const { password, confirmPassword } = this.state;
    const message = [];

    if (password.length === 0) {
      message.push('password con not leave blank');
    } else if (password.length < 8) {
      message.push('password should not shorter than 8 character');
    } else if (confirmPassword !== password) {
      message.push('password confirm not match password');
    }
    return message;
  }

  render() {
    const errorMessage = this.state.errorMessage;
    return (
      <div className="password_form">
        <input
          type="password" name="password"
          value={this.state.password}
          onChange={(event) => this.setState({ password: event.target.value })}
        />
        <input
          type="password" name="password_confirm"
          value={this.state.confirmPassword}
          onChange={(event) => this.setState({ confirmPassword: event.target.value })}
        />

        {errorMessage.length >= 0 &&
        <div className="error_message">
          { errorMessage.map((message, index) =>
            <li key={index}>
              {message}
            </li>
          )}
          </div>
        }

        <button onClick={this.onClickFinish}>
          Finish
        </button>

        <button onClick={this.onClickCancel}>
          Cancel
        </button>
      </div>
    );
  }
}

ResetPassword.propTypes = {
  increasePhase: PropTypes.func,
};

export default ResetPassword;
