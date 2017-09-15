import React, { Component } from 'react';
import {
	Navbar,
	Nav,
	Input,
	InputGroup,
	InputGroupButton
} from 'reactstrap';

import { search } from './utils/helpers.js';

const searchNavStyles = {
	width: '100%',
}

const searchBarStyles = {
	float: 'none',
	margin: '0 auto',
	width: '30%'
}

export class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: ""
        };

        this.handleQueryChange = this.handleQueryChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleQueryChange(e) {
       this.setState({query: e.target.value});
    }

    handleSearch(e) {
        e.preventDefault();
        let result = search(this.state.query, this.props.user_id);

    }

    render() {
        return (
            <Navbar color="faded" light toggleable>
                <Nav style={searchNavStyles}>
                    <InputGroup style={searchBarStyles}>
                        <Input onChange={ this.handleQueryChange } />
                        <InputGroupButton onClick={ this.handleSearch }>Search</InputGroupButton>
                    </InputGroup>
                </Nav>
            </Navbar>
        );
    }
}
