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

export function getArticles(user_id) {
    var result = [];
    $.ajaxSetup( { "async": false } );
	$.ajax(
	{
		type: 'POST',
		url: 'http://localhost:8000/articles',
		data: {
			user_id: user_id
		},
		success: function(data)
		{
			for(var i = 0, len = data.length; i < len; i++) {
	            result.push(data[i]);
	        }
		}
	});
	$.ajaxSetup( { "async": true } );
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

export function attemptRegistration(username, password, password2) {
	let result = []
	$.ajaxSetup( { "async": false } );
	$.ajax(
	{
		type: 'POST',
		url: 'http://localhost:8000/register',
		data: {
			username: username,
			password: password,
			password2: password2
		},
		success: function(data)
		{
			result = data;
		}
	});
	$.ajaxSetup( { "async": true } );
	return result
}
