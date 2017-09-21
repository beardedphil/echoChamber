import React, { Component } from 'react';
import {
	Navbar,
	NavbarBrand,
	Nav,
	NavItem,
	Button
} from 'reactstrap';

import { LoginModal } from './LoginModal.js';
import { SourcesModal } from './SourcesModal.js'
import { SearchBar } from './SearchBar.js'

const navStyles = {
	float: 'none',
	paddingBottom: '.5em'
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

	render() {
		return (
			<div>
				<div>
					<Navbar color="faded" light>
						<Nav>
							<NavbarBrand href="/">My Trusted Source</NavbarBrand>
						</Nav>
					</Navbar>
				</div>
				<div>
					<Navbar color="faded" light style={navStyles}>
						<Nav>
							<NavItem>
								{ this.props.isLoggedIn ? (
									<SourcesModal fetchArticles={ this.props.fetchArticles } buttonLabel="Who do you trust?" user_id={ this.props.user_id } />
								) : (
									<LoginModal fetchArticles={ this.props.fetchArticles } buttonLabel="Who do you trust?" title="Login" error="Please login to access this area." handleLogin={ this.props.handleLogin } />
								)}
							</NavItem>

							<NavItem className="ml-auto">
								{ this.props.isLoggedIn ? (
									<Button onClick={ this.props.handleLogout } color="primary" style={ loginToggleStyles }>Logout</Button>
								) : (
									<LoginModal fetchArticles={ this.props.fetchArticles } buttonLabel="Login" handleLogin={ this.props.handleLogin } style={ loginToggleStyles }/>
								)}
							</NavItem>
						</Nav>
					</Navbar>
				</div>
				<div>
					<SearchBar searchArticles={ this.props.searchArticles }/>
				</div>
			</div>
		);
	}
}
