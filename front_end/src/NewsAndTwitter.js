import React, { Component } from 'react';

import { Articles } from './Articles.js'

const mainContentDivStyles = {
    marginTop: '2em'
}

export class NewsAndTwitter extends Component {
    render() {
        return(
            <div className="container" style={ mainContentDivStyles }>
                <Articles articles={this.props.articles} />
            </div>
        );
    }
}
