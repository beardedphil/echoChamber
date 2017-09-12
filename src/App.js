import React, { Component } from 'react';
import './App.css';

import { Navigation } from './Navigation.js';
import { NewsAndTwitter } from './NewsAndTwitter.js';
import { getArticles } from './utils/helpers.js'

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            auth: false,
            user_id: "",
            articles: []
        };

        this.fetchArticles = this.fetchArticles.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentWillMount() {
        this.fetchArticles()
    }

    fetchArticles() {
        if(this.state.user_id) {
            console.log('Fetched with id')
            this.setState({
                articles: getArticles(this.state.user_id)
            })
        } else {
            console.log('Fetched without id')
            this.setState({
                articles: getArticles()
            })
        }
    }

    handleLogin(auth, user_id) {
        this.setState({auth: auth, user_id: user_id});
        this.fetchArticles()
    }

    handleLogout() {
        this.setState({auth: false, user_id: ""});
        this.fetchArticles()
    }

    render() {
        return(
            <div>
                <Navigation fetchArticles={ this.fetchArticles } handleLogin={ this.handleLogin } handleLogout= { this.handleLogout } isLoggedIn={ this.state.auth } user_id={ this.state.user_id } />
                <NewsAndTwitter user_id={ this.state.user_id } isLoggedIn={ this.state.auth } articles={ this.state.articles }/>
            </div>
        );
    }
}

export default App;
