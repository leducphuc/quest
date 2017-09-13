import React, { Component, PropTypes } from 'react';
import { Panel, ButtonToolbar, Button, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const CODE_REGEX = /^([0-9]{6})/;
const url_api = 'http://10.88.96.158:8084/ttx-help-desk-ver2-SNAPSHOT/service/verifyCode?userId=';
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

  onClickNext() {
    const { verifiedCode, verifyMethod } = this.state;
    const message = this.codeValidate();
    if (message.length !== 0) {
      this.setState({ errorMessage: message }, () => { console.log(message); });
    } else {
      const response = this.props.fetchApi(`${url_api}${this.props.email}&method=${verifyMethod}&code=${verifiedCode}`, { method: 'GET' });
      response.then((res) => {
        if (res.status === 'true') {
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
        <Panel>


          <div className="row col-md-8 col-md-offset-2">
            <h2>Verify your verification code</h2>
            <div className="col-md-6 left">
              <h5><label>Please select your selected verification method</label></h5>
              
              <input
                type="radio" name="method_radio"
                value="email"
                checked={this.state.verifyMethod === 'email'}
                onChange={this.onChange('verifyMethod')}
              /><label>Email my alternative email</label><br /><br />

              <input
                type="radio" name="method_radio"
                value="message"
                checked={this.state.verifyMethod === 'message'}
                onChange={this.onChange('verifyMethod')}
              /><label>Text my mobile phone</label><br /><br />

              <input
                type="radio" name="method_radio"
                value="call"
                checked={this.state.verifyMethod === 'call'}
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
            <div className="col-md-6">
              <Form>
                <FormGroup controlId="formInlineName" validationState={validate_state} >
                  <ControlLabel>We have sent you a verification code Please enter it below </ControlLabel>{' '}
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
        </Panel>
      </div>
    );
  }
}

Verify.propTypes = {
  increasePhase: PropTypes.func,
  email: PropTypes.string,
  fetchApi: PropTypes.func,
};

export default Verify;
