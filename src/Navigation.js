import React, { Component } from 'react';
import {
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	Input,
	InputGroup,
	InputGroupAddon
} from 'reactstrap';

import { LoginModal } from './LoginModal.js';
import { SourcesModal } from './SourcesModal.js'
import { Logo } from './Logo.js';
import { isLoggedIn } from './utils/helpers.js'

const navStyles = {
	paddingBottom: '1.2em'
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
							{ !isLoggedIn() ? (
								<LoginModal buttonLabel="Login"/>
							) : ('')}
							<SourcesModal buttonLabel="Who do you trust?"/>
						</Nav>
						<Nav className="ml-auto">
							<InputGroup>
								<Input />
								<InputGroupAddon>Search</InputGroupAddon>
							</InputGroup>
						</Nav>
					</Navbar>
				</div>
			</div>
		);
	}
}
