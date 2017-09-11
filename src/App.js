import React, { Component } from 'react';
import './App.css';

import { Navigation } from './Navigation.js';
import { NewsAndTwitter } from './NewsAndTwitter.js';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            auth: false,
            user_id: ""
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogin(auth, user_id) {
        this.setState({auth: auth, user_id: user_id});
    }

    handleLogout() {
        this.setState({auth: false, user_id: ""});
    }

    render() {
        return(
            <div>
                <Navigation handleLogin={ this.handleLogin } handleLogout= { this.handleLogout } isLoggedIn={ this.state.auth } />
                <p>{ this.state.user_id }</p>
                <NewsAndTwitter user_id={ this.state.user_id } isLoggedIn={ this.state.auth }/>
            </div>
        );
    }
}

export default App;
