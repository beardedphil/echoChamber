import React, { Component } from 'react';

const sourceSelectionContainerStyles = {
    border: "1px solid black",
    margin: ".5em",
    width: "90%",
    padding: ".5em"
}

const sourceSelectionLinkStyles = {
    width: "100%",
    border: "1px solid black"
}

export class Sources extends Component {
    render() {
        let row = [];
        let rowLength = 4;
        let rows = [];
        let numStories = this.props.sourceLinks.length;

        for (var i = 0, rowCount = 0; i < numStories; rowCount++) {
            for (var j = 0; j < rowLength && i < numStories; j++, i++) {
                row.push(<Source source={this.props.sourceLinks[i]} key={i}/>)
            }
            rows.push(<SourceRow sourceLinks={row} key={rowCount}/>);
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
                { this.props.sourceLinks }
            </div>
        );
    }
}

class Source extends Component {
    render() {
        return (
            <div className="col-md-3">
                <div style={sourceSelectionContainerStyles}>
                    <a href="/"><img style={sourceSelectionLinkStyles} src={this.props.source} alt={this.props.source}/></a>
                </div>
            </div>
        );
    }
}
