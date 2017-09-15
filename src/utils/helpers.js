import $ from 'jquery';

export function getUserSources(user_id) {
    var result = [];
	$.ajaxSetup( { "async": false } );
	$.ajax(
	{
		type: 'POST',
		url: 'http://localhost:8000/user_sources',
		data: {
			user_id: user_id
		},
		success: function(data) {
			for(var i = 0, len = data.length; i < len; i++) {
				result.push(data[i]);
			}
		}
	});
	$.ajaxSetup( { "async": true } );
	return result;
}

export function getOtherSources(user_id) {
    var result = [];
	$.ajaxSetup( { "async": false } );
	$.ajax(
	{
		type: 'POST',
		url: 'http://localhost:8000/other_sources',
		data: {
			user_id: user_id
		},
		success: function(data) {
			for(var i = 0, len = data.length; i < len; i++) {
				result.push(data[i]);
			}
		}
	});
	$.ajaxSetup( { "async": true } );
	return result;
}

export function getArticles(user_id, currentIndex=0, numberOfArticles=20) {
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
			for(var i = currentIndex, len = data.length, lastArticle = currentIndex + numberOfArticles; i < len && i < lastArticle; i++) {
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

export function switchTrust(sourceId, user_id, trust) {
	let result = []
	$.ajaxSetup( { "async": false } );
	$.ajax(
	{
		type: 'POST',
		url: 'http://localhost:8000/switch_trust',
		data: {
			source_id: sourceId,
			user_id: user_id,
			trust: trust
		},
		success: function(data)
		{
			result = data;
		}
	});
	$.ajaxSetup( { "async": true } );
	return result
}

export function search(query, user_id, currentIndex=0, numberOfArticles=20) {
    let result = []
    $.ajaxSetup( { "async": false } );
    $.ajax(
    {
        type: 'POST',
        url: 'http://localhost:8000/search',
        data: {
            query: query,
            user_id: user_id
        },
        success: function(data)
        {
            for(var i = currentIndex, len = data.length, lastArticle = currentIndex + numberOfArticles; i < len && i < lastArticle; i++) {
	            result.push(data[i]);
	        }
        }
    });
    $.ajaxSetup( { "async": true } );
    return result
}
