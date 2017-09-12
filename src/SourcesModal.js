import React, { Component } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';

import { Sources } from './Sources.js';
import { getUserSources, getOtherSources } from './utils/helpers.js'

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

    render() {
        let userSources = getUserSources(this.props.user_id);
        let otherSources = getOtherSources(this.props.user_id);

        let userSourceIds = [];
        let userSourceLogoUrls = [];
        let userSourceUrls = [];
        let userSourceBrands = [];
        let userSourceTrusted = []
        for (var i = 0, len = userSources.length; i < len; i++) {
            userSourceIds.push(userSources[i].id);
            userSourceLogoUrls.push(userSources[i].logo_link);
            userSourceUrls.push(userSources[i].source);
            userSourceBrands.push(userSources[i].brand);
            userSourceTrusted.push(true);
        }

        let otherSourceIds = [];
        let otherSourceLogoUrls = [];
        let otherSourceUrls = [];
        let otherSourceBrands = [];
        let otherSourceTrusted = [];
        for (var i = 0, len = otherSources.length; i < len; i++) {
            otherSourceIds.push(otherSources[i].id);
            otherSourceLogoUrls.push(otherSources[i].logo_link);
            otherSourceUrls.push(otherSources[i].source);
            otherSourceBrands.push(otherSources[i].brand);
            otherSourceTrusted.push(false);
        }

        return (
            <div>
                <Button color="primary" onClick={this.toggle}>{this.props.buttonLabel}</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className="modal-lg">
                    <ModalHeader toggle={this.toggle}>Who do you trust?</ModalHeader>
                    <ModalBody className="text-center">
                        <Sources user_id={this.props.user_id} sourceIds={userSourceIds} logoUrls={userSourceLogoUrls} sourceUrls={userSourceUrls} brands={userSourceBrands} trust={userSourceTrusted} />
                        <hr />
                        <Sources user_id={this.props.user_id} sourceIds={otherSourceIds} logoUrls={otherSourceLogoUrls} sourceUrls={otherSourceUrls} brands={otherSourceBrands} trust={otherSourceTrusted}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggle}>Done</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
