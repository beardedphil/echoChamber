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

@app.route("/articles", methods=["POST"])
@crossdomain(origin='*')
def articles():
	try:
		if not request.form.get('user_id') or request.form.get('user_id') == '':
			user_id = null
		sources = UserSource.query.filter(UserSource.user_id == request.form.get('user_id')).all()
		source_ids = []

		for source in sources:
			source_info = Source.query.filter(Source.id == source.source_id).first()
			source_ids.append(source_info.id)
			thread = threading.Thread(target=threaded_get_articles, args=(source_info.source, source_info.id))
			# thread.start()

		articles = Article.query.filter(Article.source_id.in_(source_ids))

	except:
		# Should eventually be getTopStories()
		articles = Article.query.all()

	articlesDict = []

	for article in articles:
		articleDict = article.__dict__
		articleDict.pop('_sa_instance_state')
		articleDict.pop('id')
		articleDict.pop('summary')
		articleDict.pop('publish_date')
		articleDict.pop('source_id')
		articlesDict.append(articleDict)

	return jsonify(articlesDict)

@app.route("/user_sources", methods=["POST"])
@crossdomain(origin='*')
def user_sources():
	userSources = UserSource.query.filter(UserSource.user_id == request.form.get('user_id')).all()
	userSourceList = []
	for source in userSources:
		userSourceList.append(source.source_id)

	user_sources_info = Source.query.filter(Source.id.in_(userSourceList))
	sourcesDict = []

	for source in user_sources_info:
		sourceDict = source.__dict__
		sourceDict.pop('_sa_instance_state')
		sourcesDict.append(sourceDict)

	return jsonify(sourcesDict)

@app.route("/other_sources", methods=["POST"])
@crossdomain(origin='*')
def other_sources():
	userSources = UserSource.query.filter(UserSource.user_id == request.form.get('user_id')).all()
	userSourceList = []

	for source in userSources:
		userSourceList.append(source.source_id)

	other_sources_info = Source.query.filter(~Source.id.in_(userSourceList))
	sourcesDict = []

	for source in other_sources_info:
		sourceDict = source.__dict__
		sourceDict.pop('_sa_instance_state')
		sourcesDict.append(sourceDict)

	return jsonify(sourcesDict)

@app.route("/switch_trust", methods=["POST"])
@crossdomain(origin='*')
def switch_trust():
	trust = request.form.get('trust')
	user_id = request.form.get('user_id')
	source_id = request.form.get('source_id')
	if trust == 'true':
		userSource = UserSource.query.filter(UserSource.user_id == user_id, UserSource.source_id == source_id).first()
		# Prevent deletion attempt if userSource isn't found
		if userSource:
			db.session.delete(userSource)
	else:
		userSource = UserSource.query.filter(UserSource.user_id == user_id, UserSource.source_id == source_id).first()
		# Only add to db if not already there
		if not userSource:
			userSource = UserSource(user_id, source_id)
			db.session.add(userSource)

	db.session.commit()

	response = {
		'success': True
	}

	return jsonify(response)

@app.route("/login", methods=["POST"])
@crossdomain(origin='*')
def login():
	session.clear()
	response = {'auth': False, 'error':'', 'user_id':''}

	# ensure username was submitted
	if not request.form.get('username'):
		response['error'] = 'Please provide a username'
		return jsonify(response);

	# ensure password was submitted
	if not request.form.get('password'):
		response['error'] = 'Please provide a password'
		return jsonify(response);

	# query database for username
	user = User.query.filter(User.username == request.form.get("username")).first()

	# ensure username exists and password is correct
	if user == None or not pwd_context.verify(request.form.get("password"), user.hash):
		response['error'] = 'Invalid username and/or password'
	else:
		response['auth'] = True
		response['user_id'] = user.id

	return jsonify(response);

@app.route("/register", methods=["POST"])
@crossdomain(origin='*')
def register():
	session.clear()
	response = {'success': False, 'error':''}

	# ensure username was submitted
	if not request.form.get('username'):
		response['error'] = 'Please provide a username'
		return jsonify(response);

	# ensure password was submitted
	if not request.form.get('password'):
		response['error'] = 'Please provide a password'
		return jsonify(response);

	# ensure password confirmation was submitted
	if not request.form.get('password2'):
		response['error'] = 'Please confirm your password'
		return jsonify(response);

	# ensure password and confirmation match
	if not request.form.get('password') == request.form.get('password2'):
		response['error'] = 'Password and confirmation do not match.  Please try again.'
		return jsonify(response);

	# query database for username
	user = User.query.filter(User.username == request.form.get("username")).first()

	# ensure username does not exist
	if user != None:
		response['error'] = 'Sorry, that username is taken.'
	else:
		user = User(request.form.get("username"), pwd_context.hash(request.form.get("password")))
		db.session.add(user)
		db.session.commit()
		response['success'] = True

	return jsonify(response)

@app.route("/search", methods=["POST"])
@crossdomain(origin='*')
def search():
	query = request.form.get('query')
	queryWords = query.split()
	strippedWords = []

	for word in queryWords:
		strippedWords.append((re.sub("[^a-zA-Z]+", "", word).lower()))


	return jsonify(strippedWords)

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
	app.run()
