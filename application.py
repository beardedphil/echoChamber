#!/usr/bin/env python3

from flask import Flask, render_template, send_from_directory

app = Flask(__name__)

@app.route("/")
def index():
	return render_template("index.html")

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

# if __name__ == '__main__':
#     app.debug = True
#     port = int(os.environ.get("PORT", 5000))
#     app.run(host='0.0.0.0', port=port)
