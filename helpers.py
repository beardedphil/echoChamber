from flask import Flask, render_template, url_for, request, session, redirect
from flask_session import Session
from passlib.apps import custom_app_context as pwd_context
from tempfile import mkdtemp
from functools import wraps

import newspaper
import threading
import os
import urllib.request

def login_required(f):
    """
    Decorate routes to require login.

    http://flask.pocoo.org/docs/0.11/patterns/viewdecorators/
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect(url_for("login", next=request.url))
        return f(*args, **kwargs)
    return decorated_function

def threaded_get_articles():
	with app.app_context():
		default_image_link = '/static/images/temp_rous.jpg'
		site = "cnn.com"
		cnn_paper = newspaper.build('http://' + site, memoize_articles=False)
		for article in cnn_paper.articles:
			try:
				article.download()
				article.parse()
				article.nlp()
			except:
				continue

			if not article.title or article.title == "None":
				print("No title")
			elif not article.url:
				print("No url")
			elif not article.publish_date:
				print("No publish date")
			else:
				if not article.summary:
					article.summary = "Summary not available"

				if article.top_image:
					article.image_link = article.top_image
				elif article.images:
					article.image_link = article.images[0]
				else:
					article.image_link = default_image_link

				article.logo_link = "//logo.clearbit.com/" + site

				new_article = Article(article.title, article.url, article.summary, article.image_link, article.logo_link, article.publish_date)

				db.session.add(new_article)
				db.session.commit()
