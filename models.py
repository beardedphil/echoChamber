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
    summary = db.Column(db.Text, nullable=False)
    image_link = db.Column(db.Text, nullable=False)
    logo_link = db.Column(db.Text, nullable=False)
    publish_date = db.Column(db.DateTime, nullable=False)

    def __init__(self, title, url, summary, image_link, logo_link, publish_date):
        self.title = title
        self.url = url
        self.summary = summary
        self.image_link = image_link
        self.logo_link = logo_link
        self.publish_date = publish_date
