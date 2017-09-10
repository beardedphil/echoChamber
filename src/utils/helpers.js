import $ from 'jquery';

export function isLoggedIn() {
	return true;
}

export function getSources() {
    var result = [];
	$.ajaxSetup( { "async": false } );
	$.getJSON('http://localhost:8000/sources', function(data) {
		for(var i = 0, len = data.length; i < len; i++) {
			result.push(data[i]);
		}
		$.ajaxSetup( { "async": true} );
	});

	console.log(result);
    return result;
}

export function getArticles() {
    var result = [];
    $.ajaxSetup( { "async": false } );
    $.getJSON('http://localhost:8000/articles', function(data) {
        for(var i = 0, len = data.length; i < len; i++) {
            result.push(data[i]);
        }
        $.ajaxSetup( { "async": true } );
    });

    console.log(result);
    return result;
}
