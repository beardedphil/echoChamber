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

import { attemptLogin } from './utils/helpers.js'

const loginButtonStyles = {
	marginRight: '1em'
}

export class ErrorDiv extends Component {
    render() {
        return(
            <div id="error">
                <p>{this.props.message}</p>
            </div>
        );
    }

}

export class LoginModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            username: "",
            password: "",
            auth: false,
            error: "",
            user_id: ""
        };

        this.toggle = this.toggle.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggle() {
        this.setState({
            username: "",
            password: "",
            error: "",
            modal: !this.state.modal
        });
    }

    handleUsernameChange(e) {
       this.setState({username: e.target.value});
    }

    handlePasswordChange(e) {
       this.setState({password: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        let result = attemptLogin(this.state.username, this.state.password);

        if(result.auth) {
            this.setState({auth: true, user_id: result.user_id});
            this.props.handleLogin(this.state.auth, this.state.user_id)
            this.toggle();
        } else {
            this.setState({error: result.error})
            this.setState({username: "", password: ""});
        }

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
                        { this.state.error ? (
                            <ErrorDiv message={this.state.error}/>
                        ) : (
                            <ErrorDiv message={this.props.error}/>
                        )}
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Input name="username" placeholder="Username" value={this.state.username} onChange={this.handleUsernameChange} autoComplete="off" autoFocus/>
                            </FormGroup>
                            <FormGroup>
                                <Input name="password" placeholder="Password" type="password" value={this.state.password} onChange={this.handlePasswordChange}/>
                            </FormGroup>
                            <FormGroup>
                                <Button color="primary" type="submit">Login</Button>{' '}
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
