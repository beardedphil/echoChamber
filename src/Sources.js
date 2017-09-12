import React, { Component } from 'react';
import { switchTrust } from './utils/helpers.js'

const sourceSelectionContainerStyles = {
    float: 'left',
    border: "1px solid black",
    margin: '1.2%',
    width: '22%'
}

const sourceSelectionLinkStyles = {
    width: "100%",
    border: "1px solid black"
}

const logoButtonStyles = {
    width: "90%",
    padding: '.4em 0',
    backgroundColor: 'white',
    border: 'none'
}

export class Sources extends Component {
    render() {
        let numSources = this.props.logoUrls.length;
        let sources = []

        for (var i = 0; i < numSources; i++) {
            sources.push(<Source fetchSources={this.props.fetchSources} user_id={this.props.user_id} sourceId={this.props.sourceIds[i]} logoUrl={this.props.logoUrls[i]} sourceUrl={this.props.sourceUrls[i]} brand={this.props.brands[i]} trust={this.props.trust[i]} key={i}/>)
        }

        return(
            <div>
                { sources }
            </div>
        );
    }
}

class Source extends Component {
    constructor(props) {
        super(props);

        this.sourceClickHandler = this.sourceClickHandler.bind(this);
    }

    sourceClickHandler() {
        switchTrust(this.props.sourceId, this.props.user_id, this.props.trust);
        this.props.fetchSources();
    }

    render() {
        return (
            <div style={sourceSelectionContainerStyles} onClick={ this.sourceClickHandler }>
                <button style={logoButtonStyles}><img style={sourceSelectionLinkStyles} src={this.props.logoUrl} alt={this.props.brand} /></button>
            </div>
        );
    }
}
