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
	app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://db_user:' + db_password + '@localhost/articles_mts'

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
	if not request.form.get('user_id'):
		articles = Article.query.limit(30)
	else:
		articles = getUserArticles(request.form.get('user_id'))

	return createJsonResponse(articles)

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
	# The following search and sort is based on the idea that matching all words
	# would be best, but when all words aren't matched, the earlier a word
	# appears in the query, the valuable matching that word should be.
	query = request.form.get('query')
	if not request.form.get('user_id'):
		if query == "":
			matchingArticles = Article.query.limit(30)
		else:
			matchingArticles = searchNoUser(query)
	else:
		if query == "":
			matchingArticles = getUserArticles(request.form.get('user_id'))
		else:
			matchingArticles = searchWithUser(query, request.form.get('user_id'))

	return createJsonResponse(matchingArticles)

def searchNoUser(query):
	matchingArticleIds = getMatchingArticleIds(query)
	matchingArticles = Article.query.filter(Article.id.in_(matchingArticleIds)).limit(30)

	return matchingArticles

def searchWithUser(query, user_id):
	matchingArticleIds = getMatchingArticleIds(query)
	sources = UserSource.query.filter(UserSource.user_id == request.form.get('user_id')).all()
	source_ids = []

	for source in sources:
		source_info = Source.query.filter(Source.id == source.source_id).first()
		source_ids.append(source_info.id)

	matchingArticles = Article.query.filter(Article.id.in_(matchingArticleIds)).filter(Article.source_id.in_(source_ids)).limit(30)

	return matchingArticles

def getMatchingArticleIds(query):
	matchingArticleIds = []

	# break query string into keywords (lowercase, no punctuation)
	queryWords = query.split()
	strippedWords = []
	for word in queryWords:
		strippedWords.append((re.sub("[^a-zA-Z]+", "", word).lower()))

	# get ids for each keyword
	keywordIds = []
	for word in strippedWords:
		keywordRow = Keyword.query.filter(Keyword.keyword == word).first()
		if keywordRow:
			keywordId = keywordRow.id
			keywordIds.append(keywordId)

	# for the last word, grab 10 possible matching keywords from the db
	lastWord = strippedWords[-1] + '%'
	keywordRows = Keyword.query.filter(Keyword.keyword.like(lastWord)).limit(10)
	if keywordRows:
		for keywordRow in keywordRows:
			keywordId = keywordRow.id
			keywordIds.append(keywordId)

	if not keywordIds:
		matchingArticleIds = []
	else:
		# query database for a list of all articles associated with each keyword
		articleLists = []

		for index, k_id in enumerate(keywordIds):
			article_ids = []
			articles = ArticleKeyword.query.filter(ArticleKeyword.keyword_id == k_id).limit(30)
			for article in articles:
				article_ids.append(article.article_id)
			articleLists.append(article_ids)

		# create an index for each word in the search query, then
		# build a list of lists of all possible orderings of those indices.
		indices = []
		for i in range(len(keywordIds)):
			indices.append(i)

		indicesCombos = []
		for i in indices:
			indicesCombos += itertools.combinations(indices, i + 1)

		indicesComboList = [ list(t) for t in indicesCombos ]
		indicesComboList.sort(key=len, reverse=True)

		for combo in indicesComboList:
			sets = []
			for i in combo:
				sets.append(set(articleLists[i]))

			intersection = set.intersection(*sets)
			if intersection:
				matchingArticleIds.extend(intersection)

	return matchingArticleIds

def getUserArticles(user_id):
	sources = UserSource.query.filter(UserSource.user_id == request.form.get('user_id')).all()
	source_ids = []

	for source in sources:
		source_info = Source.query.filter(Source.id == source.source_id).first()
		source_ids.append(source_info.id)

	return Article.query.filter(Article.source_id.in_(source_ids)).limit(30)

def createJsonResponse(articles):
	articlesDict = []

	for article in articles:
		articleDict = article.__dict__
		articleDict.pop('_sa_instance_state')
		articleDict.pop('id')
		articleDict.pop('publish_date')
		articleDict.pop('source_id')
		articlesDict.append(articleDict)

	return jsonify(articlesDict)


if __name__ == '__main__':
	app.run()
