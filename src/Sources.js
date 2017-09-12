import React, { Component } from 'react';
import { switchTrust } from './utils/helpers.js'

const sourceSelectionContainerStyles = {
    border: "1px solid black",
    marginBottom: '.5em'
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
        let row = [];
        let rowLength = 4;
        let rows = [];
        let numStories = this.props.logoUrls.length;

        for (var i = 0, rowCount = 0; i < numStories; rowCount++) {
            for (var j = 0; j < rowLength && i < numStories; j++, i++) {
                row.push(<Source user_id={this.props.user_id} sourceId={this.props.sourceIds[i]} logoUrl={this.props.logoUrls[i]} sourceUrl={this.props.sourceUrls[i]} brand={this.props.brands[i]} trust={this.props.trust[i]} key={i}/>)
            }
            rows.push(<SourceRow logoUrls={row} key={rowCount}/>);
            row = [];
        }

        return(
            <div>
                { rows }
            </div>
        );
    }
}

class SourceRow extends Component {
    render() {
        return(
            <div className="row">
                { this.props.logoUrls }
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
        console.log(this.props.sourceId)
    }

    render() {
        return (
            <div className="col-md-3">
                <div style={sourceSelectionContainerStyles} onClick={ this.sourceClickHandler }>
                    <button style={logoButtonStyles}><img style={sourceSelectionLinkStyles} src={this.props.logoUrl} alt={this.props.brand} /></button>
                </div>
            </div>
        );
    }
}
