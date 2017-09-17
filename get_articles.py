#!/usr/bin/env python3
from helpers import *
from models import *

app = Flask(__name__)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///echo.db'
app.config['SQLALCHEMY_ECHO'] = True
db.init_app(app)

# configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

def main():
	with app.app_context():
		default_image_link = '/src/assets/temp_rous.jpg'
		sources = Source.query.all()

		for source in sources:
			thread1 = threading.Thread(target=threaded_get_articles, args=(source.source, source.id))
			thread2 = threading.Thread(target=threaded_get_articles, args=(source.source, source.id))
			thread3 = threading.Thread(target=threaded_get_articles, args=(source.source, source.id))
			thread1.start()
			thread2.start()
			thread3.start()

def threaded_get_articles(source, source_id):
	with app.app_context():
		default_image_link = '/src/assets/temp_rous.jpg'
		paper = newspaper.build('http://' + source, language='en')
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
			else:
				if not article.summary:
					article.summary = "Summary not available"

				if article.top_image:
					article.image_link = article.top_image
				elif article.images:
					article.image_link = article.images.pop()
				else:
					article.image_link = default_image_link

				article.logo_link = "//logo.clearbit.com/" + source

				existingArticle = Article.query.filter(Article.url == article.url).first()
				similarArticle = Article.query.filter(Article.title == article.title, Article.source_id == source_id).first()

				if not existingArticle and not similarArticle:
					new_article = Article(article.title, article.url, article.summary, article.image_link, article.logo_link, article.publish_date, source_id)

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
