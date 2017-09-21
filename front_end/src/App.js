import React, { Component } from 'react';
import './App.css';

import { Navigation } from './Navigation.js';
import { NewsAndTwitter } from './NewsAndTwitter.js';
import { getArticles, search } from './utils/helpers.js'

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            auth: false,
            user_id: "",
            articles: [],
            noMatchingArticles: false
        };

        this.fetchArticles = this.fetchArticles.bind(this);
        this.searchArticles = this.searchArticles.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentWillMount() {
        this.fetchArticles()
    }

    fetchArticles() {
        var props = {}
        props.numberOfArticles = 30
        props.currentIndex = 0
        if(this.state.user_id) {
            props.user_id = this.state.user_id
        } else {
            props.user_id = -1;
        }

        getArticles( props, function(result) {
            this.setState({
                articles: result
            });
        }.bind(this));
    }

    searchArticles(query) {
        var props = {}
        props.numberOfArticles = 30
        props.currentIndex = 0
        if(this.state.user_id) {
            props.user_id = this.state.user_id
        }
        props.query = query;

        search(props, function(result) {
            if (result.length > 0) {
                this.setState({
                    articles: result,
                    noMatchingArticles: false
                });
            } else {
                this.setState({
                    articles: [],
                    noMatchingArticles: true
                })
            }
        }.bind(this));
    }

    handleLogin(auth, user_id) {
        this.setState({auth: auth, user_id: user_id}, this.fetchArticles);
    }

    handleLogout() {
        this.setState({auth: false, user_id: ""}, this.fetchArticles);
    }

    render() {
        return(
            <div>
                <Navigation searchArticles={ this.searchArticles } fetchArticles={ this.fetchArticles } handleLogin={ this.handleLogin } handleLogout= { this.handleLogout } isLoggedIn={ this.state.auth } user_id={ this.state.user_id } />
                <NewsAndTwitter user_id={ this.state.user_id } isLoggedIn={ this.state.auth } articles={ this.state.articles } noMatchingArticles={ this.state.noMatchingArticles }/>
            </div>
        );
    }
}

export default App;
