import React, { Component } from 'react';

const logoStyles = {
    width: '3em',
    height: '3em',
	marginRight: '1.2em'
};

export class Logo extends Component {
  render() {
    return (
      <img src={require('./assets/temp_rous.jpg')} style={logoStyles} alt="Rous"/>
    );
  }
}
