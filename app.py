#!/usr/bin/env python3

from flask import Flask, render_template, url_for
from models import *
import newspaper
import threading
import os

app = Flask(__name__)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///echo.db'
app.config['SQLALCHEMY_ECHO'] = True
db.init_app(app)

@app.route("/")
def index():
	return render_template("index.html")

@app.route("/users")
def users():
	user_list = User.query.all()
	print(user_list)
	return render_template("users.html", user_list=user_list)

@app.route("/articles")
def articles():
	thread = threading.Thread(target=threaded_get_articles)
	thread.start()

	return render_template("articles.html", articles=Article.query.all())

@app.route("/register")
def register():
	return render_template("register.html")

@app.route("/login")
def login():
	return render_template("login.html")

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

if __name__ == '__main__':
	app.run()
