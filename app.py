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
	user_id = request.form.get('user_id') or 29
	print(user_id)
	try:
		if not request.form.get('user_id') or request.form.get('user_id') == '':
			user_id = null
		sources = UserSource.query.filter_by(user_id = user_id).all()
		source_ids = []

		for source in sources:
			source_info = Source.query.filter_by(id = source.source_id).first()
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

@app.route("/sources", methods=["GET"])
@crossdomain(origin='*')
def sources():
	all_sources_info = Source.query.all()
	all_logo_links = []

	for source in all_sources_info:
		all_logo_links.append("//logo.clearbit.com/" + source.source)

	return jsonify(all_logo_links)

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
	user = User.query.filter_by(username=request.form.get("username")).first()

	# ensure username exists and password is correct
	if user == None or not pwd_context.verify(request.form.get("password"), user.hash):
		response['error'] = 'Invalid username and/or password'
	else:
		response['auth'] = True
		response['user_id'] = user.id

	return jsonify(response);


def threaded_get_articles(source, source_id):
	with app.app_context():
		default_image_link = '/src/assets/temp_rous.jpg'
		paper = newspaper.build('http://' + source, memoize_articles=False)
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

				new_article = Article(article.title, article.url, article.summary, article.image_link, article.logo_link, article.publish_date, source_id)

				db.session.add(new_article)
				db.session.commit()

if __name__ == '__main__':
	app.run()
