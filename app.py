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

@app.route("/")
@login_required
def index():
	return render_template("index.html")

@app.route("/users")
@login_required
def users():
	user_list = User.query.all()
	print(user_list)
	return render_template("users.html", user_list=user_list)

@app.route("/articles")
@login_required
def articles():
	thread = threading.Thread(target=threaded_get_articles)
	thread.start()

	return render_template("articles.html", articles=Article.query.all())

@app.route("/register", methods=["GET", "POST"])
def register():
    # if user reached route via POST (as by submitting a form via POST)
	if request.method == "POST":
        # ensure username was submitted
		if not request.form.get("username"):
			return render_template("register.html", error_message="must choose a username")
		elif not request.form.get("password"):
			return render_template("register.html", error_message="must choose a password")
		elif not (request.form.get("password") == request.form.get("password2")):
			return render_template("register.html", error_message="passwords must match")

        # query database for username
		username = request.form.get("username")
		rows = User.query.filter_by(username = username).first()

        # ensure username does not already exist
		if rows != None:
			return render_template("register.html", error_message="that username is already taken")
		else:
			user = User(username, pwd_context.hash(request.form.get("password")))
			db.session.add(user)
			db.session.commit()
			return render_template("login.html")

    # else if user reached route via GET (as by clicking a link or via redirect)
	return render_template("register.html")

@app.route("/login", methods=["GET", "POST"])
def login():
	session.clear()

	if request.method == "POST":

		# ensure username was submitted
		if not request.form.get("username"):
			return render_template("login.html", error_message="must provide username")

		# ensure password was submitted
		if not request.form.get("password"):
			return render_template("login.html", error_message="must provide password")

		# query database for username
		user = User.query.filter_by(username=request.form.get("username")).first()

		# ensure username exists and password is correct
		if user == None or not pwd_context.verify(request.form.get("password"), user.hash):
			return render_template("login.html", error_message="invalid username and/or password")

		# remember which user has logged in
		session["user_id"] = user.id

		# redirect user to home page
		return redirect(url_for("index"))

	# else if user reached route via GET (as by clicking a link or via redirect)
	return render_template("login.html")


if __name__ == '__main__':
	app.run()
