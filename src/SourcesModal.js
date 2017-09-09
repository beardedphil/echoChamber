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

import { Sources } from './Sources.js';
import { isLoggedIn, getSources } from './utils/helpers.js'

export class SourcesModal extends Component {
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
        let sourceLinks = getSources();

        return (
            <div>
                <Button color="primary" onClick={this.toggle}>{this.props.buttonLabel}</Button>

                {isLoggedIn() ? (
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className="modal-lg">
                        <ModalHeader toggle={this.toggle}>Who do you trust?</ModalHeader>
                        <ModalBody className="text-center">
                            <Sources sourceLinks={sourceLinks} />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.toggle}>Done</Button>
                        </ModalFooter>
                    </Modal>
                ) : (
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>Login</ModalHeader>
                        <ModalBody className="text-center">
                            <div>
                                <p>Please log in to access this area.</p>
                            </div>
                            <Form action="/login" method="post">
                                <FormGroup>
                                    <Input name="username" placeholder="Username" autoComplete="off" autoFocus/>
                                </FormGroup>
                                <FormGroup>
                                    <Input name="password" placeholder="Password" type="password" />
                                </FormGroup>
                                <FormGroup>
                                    <Button color="primary" onClick={this.login}>Login</Button>{' '}
                                    <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                                </FormGroup>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <a href="/" onClick={this.toggle}>New user? Register here!</a>
                        </ModalFooter>
                    </Modal>
                )}
            </div>
        );
    }
}
