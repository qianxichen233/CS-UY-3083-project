from flask import Flask, render_template
from datetime import timedelta
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from datetime import datetime, timedelta, timezone
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    get_jwt_identity,
    JWTManager,
    jwt_required,
    set_access_cookies,
)

import json

import os
from dotenv import load_dotenv

from apis.airplane import airplane_api
from apis.airport import airport_api
from apis.comments import comments_api
from apis.customers import customers_api
from apis.flights import flights_api
from apis.spending import spending_api
from apis.tickets import tickets_api
from apis.user import user_api
from apis.revenue import revenue_api

load_dotenv()

config = {
    "ORIGINS": [
        "http://localhost:3000",  # React
        "http://127.0.0.1:3000",  # React
    ],
}

app = Flask(__name__, template_folder="../client/build", static_folder="../client/build", static_url_path="/")
CORS(app, resources={r"/*": {"origins": config["ORIGINS"]}}, supports_credentials=True)

app.config["JWT_SECRET_KEY"] = os.getenv("jwt_secret")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_CSRF_PROTECT"] = True
app.config["JWT_CSRF_CHECK_FORM"] = True

jwt = JWTManager(app)


app.register_blueprint(airplane_api, url_prefix="/api/airplane")
app.register_blueprint(airport_api, url_prefix="/api/airport")
app.register_blueprint(comments_api, url_prefix="/api/comment")
app.register_blueprint(customers_api, url_prefix="/api/customer")
app.register_blueprint(flights_api, url_prefix="/api/flights")
app.register_blueprint(spending_api, url_prefix="/api/spending")
app.register_blueprint(tickets_api, url_prefix="/api/tickets")
app.register_blueprint(revenue_api, url_prefix="/api/revenue")
app.register_blueprint(user_api, url_prefix="/api")


@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")


# @app.after_request
# def refresh_expiring_jwts(response):
#     try:
#         exp_timestamp = get_jwt()["exp"]
#         now = datetime.now(timezone.utc)
#         # target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
#         if exp_timestamp > datetime.timestamp(now):
#             access_token = create_access_token(identity=get_jwt_identity())
#             set_access_cookies(response, access_token)
#             # data = response.get_json()
#             # if type(data) is dict:
#             #     data["access_token"] = access_token
#             #     response.data = json.dumps(data)
#         return response
#     except (RuntimeError, KeyError):
#         # Case where there is not a valid JWT. Just return the original respone
#         return response


if __name__ == "__main__":
    app.run(port=8000, debug=True)
