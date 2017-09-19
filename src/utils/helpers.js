import $ from 'jquery';

let host = (window.location.hostname === 'localhost') ? ('http://localhost:8000/') : ('/api/')

export function getUserSources(user_id, callback) {
    var result = [];
	$.ajax(
	{
		type: 'POST',
		url: host + 'user_sources',
		data: {
			user_id: user_id
		},
		success: function(data) {
			for(var i = 0, len = data.length; i < len; i++) {
				result.push(data[i]);
			}
            callback(result);
		}
	});
}

export function getOtherSources(user_id, callback) {
    var result = [];
	$.ajax(
	{
		type: 'POST',
		url: host + 'other_sources',
		data: {
			user_id: user_id
		},
		success: function(data) {
			for(var i = 0, len = data.length; i < len; i++) {
				result.push(data[i]);
			}
            callback(result);
		}
	});
}

export function getArticles(props, callback) {
    var result = [];
    var data = {};

    if (props.user_id !== -1) {
        data = {
            user_id: props.user_id
        }
    }

	$.ajax(
	{
		type: 'POST',
		url: host + 'articles',
		data: data,
		success: function(data)
		{
			for(var i = props.currentIndex, len = data.length, lastArticle = props.currentIndex + props.numberOfArticles; i < len && i < lastArticle; i++) {
	            result.push(data[i]);
	        }
            callback(result);
		}
	});

}

export function attemptLogin(username, password, callback) {
	$.ajax(
	{
	    type: 'POST',
	    url: host + 'login',
	    data: {
			username: username,
			password: password
		},
	    success: function(data)
	    {
			callback(data)
	    }
	});
}

export function attemptRegistration(username, password, password2, callback) {
	$.ajax(
	{
		type: 'POST',
		url: host + 'register',
		data: {
			username: username,
			password: password,
			password2: password2
		},
		success: function(data)
		{
			callback(data)
		}
	});
}

export function switchTrust(sourceId, user_id, trust, callback) {
	$.ajax(
	{
		type: 'POST',
		url: host + 'switch_trust',
		data: {
			source_id: sourceId,
			user_id: user_id,
			trust: trust
		},
		success: function(data)
		{
			callback(data);
		}
	});
}

export function search(props, callback) {
    let result = []
    let data = {}
    data.query = props.query
    if (props.user_id) {
        data.user_id = props.user_id
    }

    $.ajax(
    {
        type: 'POST',
        url: host + 'search',
        data: data,
        success: function(data)
        {
            for(var i = props.currentIndex, len = data.length, lastArticle = props.currentIndex + props.numberOfArticles; i < len && i < lastArticle; i++) {
	            result.push(data[i]);
	        }
            callback(result)
        }
    });
}
