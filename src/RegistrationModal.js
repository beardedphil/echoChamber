import React, { Component } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Input
} from 'reactstrap';

import { attemptRegistration } from './utils/helpers.js'

export class ErrorDiv extends Component {
    render() {
        return(
            <div id="error">
                <p>{this.props.message}</p>
            </div>
        );
    }
}

export class RegistrationModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            username: "",
            password: "",
            password2: "",
            error: ""
        };

        this.toggle = this.toggle.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePassword2Change = this.handlePassword2Change.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggle() {
        this.setState({
            username: "",
            password: "",
            password2: "",
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

    handlePassword2Change(e) {
       this.setState({password2: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        let result = attemptRegistration(this.state.username, this.state.password, this.state.password2);

        console.log(result);

        if(result.success) {
            this.toggle();
        } else {
            this.setState({error: result.error})
            this.setState({username: "", password: "", password2: ""});
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
                <a href="#" onClick={this.toggle}>{this.props.text}</a>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Register</ModalHeader>
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
                                <Input name="password2" placeholder="Confirm password" type="password" value={this.state.password2} onChange={this.handlePassword2Change}/>
                            </FormGroup>
                            <FormGroup>
                                <Button color="primary" type="submit">Register</Button>{' '}
                                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}
