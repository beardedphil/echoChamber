import React, { Component } from 'react';

import { getArticles } from './utils/helpers.js'
import { Articles } from './Articles.js'

const categoryName = {
    textAlign: "center",
    margin: "1em"
}

export class NewsAndTwitter extends Component {
    render() {
        return(
            <div>
                { this.props.isLoggedIn ? (
                    <div className="container" id="main">
                        <MainHeadings mainCategory="Your News" />
                        <Articles articles={getArticles(this.props.user_id)} />
                    </div>
                ) : (
                    <div className="container" id="main">
                        <MainHeadings mainCategory="Top Stories" />
                        <Articles articles={getArticles()} />
                    </div>
                )};
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
