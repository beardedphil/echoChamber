import React, { Component } from 'react';
import './App.css';

import { Navigation } from './Navigation.js';
import { NewsAndTwitter } from './NewsAndTwitter.js';

class App extends Component {
  render() {
    return (
        <div>
            <Navigation />
            <NewsAndTwitter />
        </div>
    );
  }
}

export default App;
