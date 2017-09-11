import React, { Component } from 'react';

const logoStyles = {
    position: "absolute",
    top: ".5em",
    left: ".5em",
    width: "2.5em",
    zIndex: 3
}

const articleStyles = {
    position: "relative",
    border: "1px solid black",
    borderRadius: "7px",
    marginBottom: "1em",
    overflow: "hidden",
    backgroundColor: "black",
    height: "15em",
    zIndex: 1
}

const titleStyles = {
    fontSize: ".85em",
    fontWeight: "bold",
    color: "#f3f3f3"
}

const titleBackgroundStyles = {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,.6)",
    zIndex: 3,
    padding: ".5em 1em"
}

const articleImageStyles = {
    position: "relative",
    top: 0,
    left: 0,
    zIndex: 1,
    width: "100%"
}

export class Articles extends Component {
    render() {
        let row = [];
        let rowLength = 2;
        let rows = [];
        let numArticles = this.props.articles.length;

        for (var i = 0, rowCount = 0; i < numArticles; rowCount++) {
            for (var j = 0; j < rowLength && i < numArticles; j++, i++) {
                row.push(<Article source={this.props.articles[i]} key={i}/>)
            }
            rows.push(<ArticleRow articles={row} key={rowCount}/>);
            row = [];
        }

        return(
            <div>
                { rows }
            </div>
        );
    }
}

class ArticleRow extends Component {
    render() {
        return(
            <div className="row">
                { this.props.articles }
            </div>
        );
    }
}

class Article extends Component {
    render() {
        return (
            <div className="col-md-4">
                <a href={ this.props.source.url } style={ titleStyles } target="_blank">
                    <div style={ articleStyles }>
                        <img style={ logoStyles } src={ this.props.source.logo_link } alt="Not found" />
                        <img style={ articleImageStyles } src={ this.props.source.image_link } alt="Not found" />
                        <div style={ titleBackgroundStyles }>
                            <p>{ this.props.source.title }</p>
                        </div>
                    </div>
                </a>
            </div>
        );
    }
}
