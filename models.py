from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    username = db.Column(db.Text, unique=True, nullable=False)
    hash = db.Column(db.Text, nullable=False)

    def __init__(self, username, hash):
        self.username = username
        self.hash = hash

class Article(db.Model):
    __tablename__ = 'articles'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    title = db.Column(db.Text, nullable=False)
    url = db.Column(db.Text, nullable=False)
    text = db.Column(db.Text, nullable=False)
    image_link = db.Column(db.Text, nullable=True)
    logo_link = db.Column(db.Text, nullable=True)
    summary = db.Column(db.Text, nullable=True)

    def __init__(self, title, url, text):
        self.title = title
        self.url = url
        self.text = text

class Author(db.Model):
    __tablename__ = 'authors'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    article_id = db.Column(db.Integer, nullable=False)
    author = db.Column(db.Text, nullable=False)

    def __init__(self, article_id, author):
        self.article_id = article_id
        self.author = author

class Image(db.Model):
    __tablename__ = 'images'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    article_id = db.Column(db.Integer, nullable=False)
    image_link = db.Column(db.Text, nullable=False)

    def __init__(self, article_id, image_link):
        self.article_id = article_id
        self.image = image
