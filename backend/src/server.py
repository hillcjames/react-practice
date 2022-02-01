from flask import Flask, request

app = Flask(__name__)

@app.route("/")
def hello_world():
    # This is the exact opposite of safe. The textbook definition of an injection vulnerability, I think. Just here for testing.
    arg = request.args.get('username')
    return "<p>Hello, World!" + arg + "</p>"
