import React, { Component } from 'react';

import { isLoggedIn, getArticles } from './utils/helpers.js'
import { Articles } from './Articles.js'

const categoryName = {
    textAlign: "center",
    margin: "1em"
}

export class NewsAndTwitter extends Component {
    render() {
        let layout = null;

        if (isLoggedIn()) {
            layout = <MainHeadings mainCategory="Your News" />
        } else {
            layout = <MainHeadings mainCategory="Top Stories" />
        }

        return(
            <div className="container" id="main">
                { layout }
                <Articles articles={getArticles()} />
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
