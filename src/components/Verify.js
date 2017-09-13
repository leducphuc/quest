import React, { Component, PropTypes } from 'react';
import { ButtonToolbar, Button, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { url_api } from '../constant';

const CODE_REGEX = /^([0-9]{6})/;
class Verify extends Component {
  constructor(props) {
    super(props);
    this.onClickNext = this.onClickNext.bind(this);
    this.codeValidate = this.codeValidate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
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
      response.then((res) => {
        console.log(res);
        if (res.result === 'SUCCESS') {
          this.props.increasePhase();
        } else {
          this.setState({ errorMessage: ['Wrong code'] });
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

  codeValidate() {
    const { code, verifyMethod } = this.state;
    const message = [];

    if (code.length === 0) {
      message.push('Code con not leave blank');
    } else if (!CODE_REGEX.test(code)) {
      message.push('Invalid code');
    }
    if (verifyMethod === '') {
      message.push('Verify method must be choosed');
    }
    return message;
  }

  render() {
    const errorMessage = this.state.errorMessage;
    const validate_state = errorMessage.length === 0 ? null : 'error';
    return (
      <div className="code_form">
        <div className="row">
          <div className="page-title">
            <h2>Verify your verification code</h2>
          </div>
          <div className="col-md-5 left">
            <h5><label>Please select your selected verification method</label></h5>

            <input
              type="radio" name="method_radio"
              value="MAIL"
              checked={this.state.verifyMethod === 'MAIL'}
              onChange={this.onChange('verifyMethod')}
            /><label>Email my alternative email</label><br /><br />

            <input
              type="radio" name="method_radio"
              value="SMS"
              checked={this.state.verifyMethod === 'SMS'}
              onChange={this.onChange('verifyMethod')}
            /><label>Text my mobile phone</label><br /><br />

            <input
              type="radio" name="method_radio"
              value="CALL"
              checked={this.state.verifyMethod === 'CALL'}
              onChange={this.onChange('verifyMethod')}
            /><label>Call my mobile phone</label><br /><br />

            {errorMessage.length >= 0 &&
              <div className="error_message">
                {errorMessage.map((message, index) =>
                  <li key={index}>
                    {message}
                  </li>
                )}
              </div>
            }
          </div>
          <div className="col-md-6 code-input">
            <Form>
              <FormGroup controlId="formInlineName" validationState={validate_state} >
                <ControlLabel>
                  We have sent you a verification code Please enter it below </ControlLabel>{' '}
                <FormControl type="text" value={this.state.code} onChange={this.onChange('code')} />
              </FormGroup>
            </Form><br />

            <p>
              <ButtonToolbar>
                <Button bsStyle="primary" onClick={this.onClickNext}>
                  Next
               </Button>

                <Button bsStyle="warning" onClick={this.onClickCancel}>
                  Cancel
                </Button>
              </ButtonToolbar>
            </p>
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
};

export default Verify;
