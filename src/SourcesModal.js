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

const hrStyles = {
    width: '100%',
}

const modalBodyStyles = {
    textAlign: 'center',
    paddingLeft: '2em'
}

export class SourcesModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            userSources: [],
            otherSources: []
        };

        this.toggle = this.toggle.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }

    componentWillMount() {
        this.fetchData()
    }

    fetchData() {
        this.setState({
            userSources: getUserSources(this.props.user_id),
            otherSources: getOtherSources(this.props.user_id)
        })
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        let userSources = this.state.userSources;
        let otherSources = this.state.otherSources;

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
                    <ModalBody style={modalBodyStyles}>
                        <h3>These are your trusted sources:</h3>
                        <h6>(Click a source to remove it)</h6>
                        <Sources fetchData={this.fetchData} user_id={this.props.user_id} sourceIds={userSourceIds} logoUrls={userSourceLogoUrls} sourceUrls={userSourceUrls} brands={userSourceBrands} trust={userSourceTrusted} />
                        <hr style={hrStyles} />
                        <hr style={hrStyles} />
                        <h3>You have not trusted these sources:</h3>
                        <h6>(Click a source to add it to your trusted sources)</h6>
                        <Sources fetchData={this.fetchData} user_id={this.props.user_id} sourceIds={otherSourceIds} logoUrls={otherSourceLogoUrls} sourceUrls={otherSourceUrls} brands={otherSourceBrands} trust={otherSourceTrusted}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggle}>Done</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
