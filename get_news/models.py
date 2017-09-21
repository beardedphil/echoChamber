from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func

from datetime import datetime

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
    image_link = db.Column(db.Text, nullable=False)
    logo_link = db.Column(db.Text, nullable=False)
    publish_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    source_id = db.Column(db.Integer, nullable=False)

    def __init__(self, title, url, image_link, logo_link, publish_date, source_id):
        self.title = title
        self.url = url
        self.image_link = image_link
        self.logo_link = logo_link
        self.publish_date = publish_date
        self.source_id = source_id

class Source(db.Model):
    __tablename__ = 'sources'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    source = db.Column(db.Text, nullable=False)
    logo_link = db.Column(db.Text, nullable=False)
    brand = db.Column(db.Text, nullable=False)

    def __init__(self, source, logo_link, brand):
        self.source = source
        self.logo_link = logo_link
        self.brand = brand

class Keyword(db.Model):
    __tablename__ = 'keywords'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    keyword = db.Column(db.Text, nullable=False)

    def __init__(self, keyword):
        self.keyword = keyword

class ArticleKeyword(db.Model):
    __tablename__ = 'articles_keywords'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    article_id = db.Column(db.Integer, nullable=False)
    keyword_id = db.Column(db.Integer, nullable=False)

    def __init__(self, article_id, keyword_id):
        self.article_id = article_id
        self.keyword_id = keyword_id

class UserSource(db.Model):
    __tablename__ = 'users_sources'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    source_id = db.Column(db.Integer, nullable=False)

    def __init__(self, user_id, source_id):
        self.user_id = user_id
        self.source_id = source_id
