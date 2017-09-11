import React, { Component } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';

import { Sources } from './Sources.js';
import { getSources } from './utils/helpers.js'

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
                <Modal isOpen={this.state.modal} toggle={this.toggle} className="modal-lg">
                    <ModalHeader toggle={this.toggle}>Who do you trust?</ModalHeader>
                    <ModalBody className="text-center">
                        <Sources sourceLinks={sourceLinks} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggle}>Done</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
