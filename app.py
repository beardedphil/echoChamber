#!/usr/bin/env python3

from flask import Flask, render_template
from models import *

app = Flask(__name__)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///echo.db'
app.config['SQLALCHEMY_ECHO'] = True
db.init_app(app)

@app.route("/")
def index():
	user_list = User.query.all()
	return render_template("index.html", user_list)

if __name__ == '__main__':
	app.run()
