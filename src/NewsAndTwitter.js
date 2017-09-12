import React, { Component } from 'react';

import { Articles } from './Articles.js'

const categoryName = {
    textAlign: "center",
    margin: "1em"
}

export class NewsAndTwitter extends Component {
    render() {
        return(
            <div className="container" id="main">
                { this.props.isLoggedIn ? (
                    <MainHeadings mainCategory="Your News" />
                ) : (
                    <MainHeadings mainCategory="Top Stories" />
                ) }
                <Articles articles={this.props.articles} />
            </div>
        );
    }
}

class MainHeadings extends Component {
    render() {
        return(
            <div className="row">
                <div className="col-md-8">
                    <h3 style={ categoryName }>{this.props.mainCategory}</h3>
                </div>
                <div className="col-md-4">
                    <h3 style={ categoryName }>Trending</h3>
                </div>
            </div>
        );
    }
}
