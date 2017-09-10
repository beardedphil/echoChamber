import $ from 'jquery';

export function isLoggedIn() {
	return true;
}

export function getSources() {
    let sourceLinks = [
        "//logo.clearbit.com/cnn.com",
        "//logo.clearbit.com/msnbc.com",
        "//logo.clearbit.com/latimes.com",
        "//logo.clearbit.com/washingtonpost.com",
        "//logo.clearbit.com/newyorktimes.com",
        "//logo.clearbit.com/wsj.com",
        "//logo.clearbit.com/breitbart.com",
        "//logo.clearbit.com/nbcnews.com",
        "//logo.clearbit.com/news.bbc.co.uk",
        "//logo.clearbit.com/foxnews.com",
        "//logo.clearbit.com/slate.com",
    ];

    return sourceLinks;
}

export function getArticles() {
    var result = [];
    $.ajaxSetup( { "async": false } );
    $.getJSON('http://localhost:8000', function(data) {
        for(var i = 0, len = data.length; i < len; i++) {
            result.push(data[i]);
        }
        $.ajaxSetup( { "async": true } );
    });

    console.log(result);
    return result;
}
