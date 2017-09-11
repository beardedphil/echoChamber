import $ from 'jquery';

export function isLoggedIn() {
	return false;
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

    return result;
}

export function attemptLogin(username, password) {
	let result = []
	$.ajaxSetup( { "async": false } );
	$.ajax(
	{
	    type: 'POST',
	    url: 'http://localhost:8000/login',
	    data: {
			username: username,
			password: password
		},
	    success: function(data)
	    {
			result = data;
	    }
	});
	$.ajaxSetup( { "async": true } );
	return result
}
