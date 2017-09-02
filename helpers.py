from flask import Flask, render_template, url_for, request, session, redirect, g
from flask_session import Session
from passlib.apps import custom_app_context as pwd_context
from tempfile import mkdtemp
from functools import wraps

import newspaper
import threading
import os
import urllib.request

app = Flask(__name__)

def login_required(f):
	"""
	Decorate routes to require login.

	http://flask.pocoo.org/docs/0.11/patterns/viewdecorators/
	"""
	@wraps(f)
	def decorated_function(*args, **kwargs):
		if not g.user_id:
			return redirect(url_for("login"))
		return f(*args, **kwargs)
	return decorated_function
