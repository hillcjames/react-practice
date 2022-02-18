from flask import Flask, request
from flask_cors import CORS, cross_origin

from flask_redis import Redis
import pickle
import json


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

redis = Redis(app)


@app.route("/")
@cross_origin()
def hello_world():
    # This is the exact opposite of safe. Just here for testing.
    arg = request.args.get('username')
    if arg:
        return "<p>Hello, World!" + arg + "</p>"
    else:
        return "<p>Hello, World! (no args)</p>"


@app.route("/planetoids/")
@cross_origin()
def getPlanetoids():
    key = 'temp4'
    # This is the exact opposite of safe. Just here for testing.
    val = load(key)
    print("get ", val, val == None, val == pickle.dumps(None), pickle.dumps(0), pickle.dumps(None) == None, pickle.dumps(0) == pickle.dumps(None))
    if val == None:
        success = save(key, 0)
    else:
        success = save(key, val + 1)
    print(success)

    return json.dumps({"success": True, "data": "here" + str(val)})


def save(key, value):
    return redis.set(key, pickle.dumps(value))

def load(key):
    result = redis.get(key)
    print("loading ", result)
    if result:
        return pickle.loads(result)
    else:
        return None
