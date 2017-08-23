import React, { Component, PropTypes } from 'react';
import Recaptcha from 'react-recaptcha';

const CODE_REGEX = /^([0 - 9]{4})$/;
class Verify extends Component {
  constructor(props) {
    super(props);
    this.onClickNext = this.onClickNext.bind(this);
    this.codeValidate = this.codeValidate.bind(this);
    this.state = {
      code: '',
      captchaValid: false,
      errorMessage: [],
      verifiedCode: false,
    };
  }

  onClickNext() {
        // const { verifiedCaptcha, errorMessage } = this.state;
        // if (errorMessage.length === 0 && verifiedCaptcha ) {
        //     this.props.inCreasePhase();
        // }

    const { verifiedCode } = this.state;
    const message = this.codeValidate();
    if (message.length !== 0) {
      this.setState({ errorMessage: message }, () => { console.log(message); });
    }
    // else if (verifiedCaptcha) {
    //   this.props.increasePhase();
    // }
  }

  codeValidate() {
    const code = this.state.code;
    const message = [];

    if (code.length === 0) {
      message.push('Code con not leave blank');
    } else if (!CODE_REGEX.test(code)) {
      message.push('Invalid code');
    }
    return message;
  }

  render() {
    const errorMessage = this.state.errorMessage;
    return (
      <div className="code_form">
        <input
          type="text" name="verify_code"
          value={this.state.code}
          onChange={(event) => this.setState({ code: event.target.value })}
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

        <button onClick={this.onClickNext}>
                    Next
        </button>
      </div>
    );
  }
}

Verify.propTypes = {
  increasePhase: PropTypes.func,
};

export default Verify;
