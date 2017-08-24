import React, { Component, PropTypes } from 'react';
import {
  Button, Modal, ModalBody, ModalHeader, ModalFooter,
  FormGroup, FormControl, ControlLabel, Form, ButtonToolbar
} from 'react-bootstrap';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.onClickFinish = this.onClickFinish.bind(this);
    this.passwordValidate = this.passwordValidate.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
    this.state = {
      password: '',
      confirmPassword: '',
      errorMessage: [],
      success: false,
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.password !== nextState.password ||
      this.state.confirmPassword !== nextState.confirmPassword) {
      this.setState({ errorMessage: [] });
    }
  }

  onClickFinish() {
    const message = this.passwordValidate();
    if (message.length !== 0) {
      this.setState({ errorMessage: message }, () => { console.log(message); });
    } else {
      this.setState({ success: true });
    }
  }

  onClickCancel() {
    this.setState({
      password: '',
      confirmPassword: '',
      errorMessage: [],
    });
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
    const { errorMessage, success, password, confirmPassword } = this.state;
    const validate_state = errorMessage.length === 0 ? null : 'error';
    return (
      <div className="password_form">
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
          <FormGroup controlId="formInlineName" validationState={validate_state} >
            <ControlLabel>Password </ControlLabel>{' '}
            <FormControl type="password" value={password} onChange={(event) => this.setState({ password: event.target.value.trim() })} />

            <ControlLabel>Password Confirm</ControlLabel>{' '}
            <FormControl type="password" value={confirmPassword} onChange={(event) => this.setState({ confirmPassword: event.target.value.trim() })} />
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
        <ButtonToolbar>
          <Button bsStyle="primary" onClick={this.onClickFinish}>
            Finish
        </Button>

          <Button bsStyle="warning" onClick={this.onClickCancel}>
            Cancel
        </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

ResetPassword.propTypes = {
  increasePhase: PropTypes.func,
};

export default ResetPassword;
