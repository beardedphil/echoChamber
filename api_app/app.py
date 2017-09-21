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
	if matchingArticleIds:
		matchingArticleIds = matchingArticleIds[:30]
		matchingArticles = Article.query.filter(Article.id.in_(matchingArticleIds)).all()
	else:
		return []

	return matchingArticles

def searchWithUser(query, user_id):
	matchingArticleIds = getMatchingArticleIds(query)
	if matchingArticleIds:
		sources = UserSource.query.filter(UserSource.user_id == request.form.get('user_id')).all()
		source_ids = []

		for source in sources:
			source_info = Source.query.filter(Source.id == source.source_id).first()
			source_ids.append(source_info.id)

		matchingArticleIds = matchingArticleIds[:30]
		matchingArticles = Article.query.filter(Article.id.in_(matchingArticleIds)).filter(Article.source_id.in_(source_ids)).limit(30)
		return matchingArticles
	else:
		return []

def getMatchingArticleIds(query):
	matchingArticleIds = []

	# break query string into keywords (lowercase, no punctuation)
	queryWords = query.split()
	strippedWords = []
	for word in queryWords:
		strippedWords.append((re.sub("[^a-zA-Z]+", "", word).lower()))

	# if the query ends in a space, the user is not in the middle of typing a word
	# otherwise, we assume that the user may not be finished with the current word
	if query[-1] == ' ':
		wordInProgress = ""
	else:
		wordInProgress = strippedWords[-1]
		possibleWordInProgress = wordInProgress + '%'
		strippedWords = strippedWords[:-1]

	# get ids for each keyword
	keywordIds = []
	for word in strippedWords:
		keywordRow = Keyword.query.filter(Keyword.keyword == word).first()
		# if the keyword is in the database, add the id to the list and proceed
		if keywordRow:
			keywordId = keywordRow.id
			keywordIds.append(keywordId)
		# if any keyword isn't found, the filter should return no articles
		else:
			return []

	# if there is a word in progress and it is at least two letters long,
	# grab all possible matching keywords from the db
	possibleKeywordIds = []

	if len(wordInProgress) > 1:
		wipRow = Keyword.query.filter(Keyword.keyword == wordInProgress).first()
		pWipRows = Keyword.query.filter(Keyword.keyword.like(possibleWordInProgress)).all()

		if wipRow:
			possibleKeywordIds.append(wipRow.id)

		if pWipRows:
			for pWipRow in pWipRows:
				pWipId = pWipRow.id
				possibleKeywordIds.append(pWipId)
		else:
			return []

	if not keywordIds and not possibleKeywordIds:
		return []
	else:
		# query database for a list of all articles associated with each keyword
		# except for the word in progress

		for k_id in keywordIds:
			article_ids = []
			articleKeywordRows = ArticleKeyword.query.filter(ArticleKeyword.keyword_id == k_id).all()

			# If there are no articles matching a keyword, then the filter should return no articles
			if not articleKeywordRows:
				return []

			for row in articleKeywordRows:
				article_ids.append(row.article_id)

			# Case - First keyword
			if matchingArticleIds == []:
				matchingArticleIds = article_ids
			else:
				sets = []
				sets.append(set(matchingArticleIds))
				sets.append(set(article_ids))
				intersection = set.intersection(*sets)
				if intersection:
					matchingArticleIds = []
					matchingArticleIds.extend(intersection)
				else:
					return []

	# word in progress should only eliminate results that are no longer possible
	possibleMatchingArticleIds = []

	for pk_id in possibleKeywordIds:
		articleKeywordRows = ArticleKeyword.query.filter(ArticleKeyword.keyword_id == pk_id).all()

		# If there are no articles matching a keyword, then the keyword should be skipped
		if not articleKeywordRows:
			continue

		for row in articleKeywordRows:
			possibleMatchingArticleIds.append(row.article_id)

	if matchingArticleIds == []:
		return possibleMatchingArticleIds
	elif possibleMatchingArticleIds == []:
		return matchingArticleIds
	else:
		sets = []
		sets.append(set(possibleMatchingArticleIds))
		sets.append(set(matchingArticleIds))
		intersection = set.intersection(*sets)
		if intersection:
			matchingArticleIds = []
			matchingArticleIds.extend(intersection)
			return matchingArticleIds
		else:
			return []

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
