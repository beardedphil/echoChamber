import React, { Component } from 'react';
import {
	Navbar,
	Nav,
	Input,
	InputGroup
} from 'reactstrap';

const searchNavStyles = {
	width: '100%',
}

const searchBarStyles = {
	float: 'none',
	margin: '0 auto',
	width: '20em'
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
       this.setState({query: e.target.value})
       this.props.searchArticles(e.target.value)
    }

    handleSearch(e) {
        e.preventDefault();
        this.props.searchArticles(this.state.query)
        this.setState({query: ""})
    }

    render() {
        return (
            <Navbar color="faded" light toggleable>
                <Nav style={searchNavStyles}>
                    <InputGroup style={searchBarStyles}>
                        <Input value={this.state.query} onChange={ this.handleQueryChange } />
                    </InputGroup>
                </Nav>
            </Navbar>
        );
    }
}
