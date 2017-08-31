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
			elif not article.text or article.text == "None" or article.text == "":
				print("No text")
			else:
				new_article = Article(article.title, article.url, article.text)

				if article.top_image:
					new_article.image_link = article.top_image
				elif article.images:
					new_article.image_link = article.images[0]
				else:
					new_article.image_link = NULL

				if article.summary:
					new_article.summary = article.summary
				else:
					new_article.summary = "Summary not available"

				logo_link = "//logo.clearbit.com/" + site
				new_article.logo_link = logo_link

				db.session.add(new_article)
				db.session.commit()

				for author in article.authors:
					new_author = Author(new_article.id, author)
					db.session.add(new_author)

				db.session.commit()

if __name__ == '__main__':
	app.run()
