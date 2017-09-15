import React, { Component } from 'react';
import {
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	Button
} from 'reactstrap';

import { LoginModal } from './LoginModal.js';
import { SourcesModal } from './SourcesModal.js'
import { Logo } from './Logo.js';
import { SearchBar } from './SearchBar.js'

const navStyles = {
	float: 'none',
	paddingBottom: '1.2em'
}

const loginToggleStyles = {
	marginRight: '1em'
}

export class Navigation extends Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			isOpen: false
		};
	}

	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}

	handleSearch() {
		console.log('search')
	}

	render() {
		return (
			<div>
				<div>
					<Navbar color="faded" light toggleable>
						<Nav>
							<NavbarToggler right onClick={this.toggle} />
							<Logo />
							<NavbarBrand href="/">Echo Chamber</NavbarBrand>
						</Nav>
					</Navbar>
				</div>
				<div>
					<Navbar color="faded" light toggleable style={navStyles}>
						<Nav>
							{ this.props.isLoggedIn ? (
								<SourcesModal fetchArticles={ this.props.fetchArticles } buttonLabel="Who do you trust?" user_id={ this.props.user_id } />
							) : (
								<LoginModal fetchArticles={ this.props.fetchArticles } buttonLabel="Who do you trust?" title="Login" error="Please login to access this area." handleLogin={ this.props.handleLogin } />
							)}

						</Nav>
						<Nav className="ml-auto">
							{ this.props.isLoggedIn ? (
								<Button onClick={ this.props.handleLogout } color="primary" style={ loginToggleStyles }>Logout</Button>
							) : (
								<LoginModal fetchArticles={ this.props.fetchArticles } buttonLabel="Login" handleLogin={ this.props.handleLogin } style={ loginToggleStyles }/>
							)}
						</Nav>
					</Navbar>
				</div>
				<div>
					<SearchBar />
				</div>
			</div>
		);
	}
}
