import React, { Component } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input
} from 'reactstrap';

const loginButtonStyles = {
	marginRight: '1em'
}

export class LoginModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    showModal() {
        this.setState({
            modal: true
        });
    }

    render() {
        return (
            <div>
                <Button color="primary" style={loginButtonStyles} onClick={this.toggle}>{this.props.buttonLabel}</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Login</ModalHeader>
                    <ModalBody className="text-center">
                        <div id="error">
                            <p>{this.props.error}</p>
                        </div>
                        <Form action="/login" method="post">
                            <FormGroup>
                                <Input name="username" placeholder="Username" autoComplete="off" autoFocus/>
                            </FormGroup>
                            <FormGroup>
                                <Input name="password" placeholder="Password" type="password" />
                            </FormGroup>
                            <FormGroup>
                                <Button color="primary" onClick={this.toggle}>Login</Button>{' '}
                                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <a href="/" onClick={this.toggle}>New user? Register here!</a>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
