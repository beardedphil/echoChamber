#!/usr/bin/env python3

from flask import Flask, render_template, url_for
from models import *

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
	# articles = Article.query.all()
	# print(articles)
	# return render_template("articles.html", articles=articles)
	return render_template("articles.html")

@app.route("/register")
def register():
	return render_template("register.html")

@app.route("/login")
def login():
	return render_template("login.html")

if __name__ == '__main__':
	app.run()
