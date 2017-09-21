#!/usr/bin/env python3
from helpers import *
from models import *

import pymysql
from local_settings import *

app = Flask(__name__)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
if environment == 'dev':
	app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../echo.db'
else:
	app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://db_user:db_password@localhost/articles_mts'
app.config['SQLALCHEMY_ECHO'] = True
db.init_app(app)

# configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

def main():
	with app.app_context():
		sources = Source.query.all()

		for source in sources:
			paper = newspaper.build('http://' + source.source, language='en', memoize=False)
			for article in paper.articles:
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
				elif not article.keywords or article.keywords == None:
					print("No keywords")
				elif not article.summary:
					print("No summary")
				elif not article.top_image and not article.images:
					print("Images not available")
				else:
					if article.top_image:
						article.image_link = article.top_image
					else:
						article.image_link = article.images.pop()

					article.logo_link = "//logo.clearbit.com/" + source.source

					existingArticle = Article.query.filter(Article.url == article.url).first()
					similarArticle = Article.query.filter(Article.title == article.title, Article.source_id == source.id).first()

					if not existingArticle and not similarArticle:
						new_article = Article(article.title, article.url, article.image_link, article.logo_link, article.publish_date, source.id)

						db.session.add(new_article)
						db.session.flush()
						db.session.commit()

						for keyword in article.keywords:
							existingKeyword = Keyword.query.filter(Keyword.keyword == keyword).first()
							if not existingKeyword:
								newKeyword = Keyword(keyword)
								db.session.add(newKeyword)
								db.session.flush()
								keywordId = newKeyword.id
								db.session.commit()
							else:
								keywordId = existingKeyword.id

							articleKeyword = ArticleKeyword(new_article.id, keywordId)
							db.session.add(articleKeyword)
							db.session.commit()


if __name__ == '__main__':
	main()
