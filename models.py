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
