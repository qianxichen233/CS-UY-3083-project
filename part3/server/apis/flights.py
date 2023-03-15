from flask import Blueprint, request, jsonify

from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required

flights_api = Blueprint('flights_api', __name__)

@flights_api.route("/", methods = ["GET"])
@jwt_required(locations='cookies')
def get_flights():
    print(get_jwt_identity())
    return {'msg': 'under development'}

@flights_api.route("/", methods = ["PUT"])
def create_flights():
    return {'msg': 'under development'}

@flights_api.route("/status", methods = ["GET"])
def get_flights_status():
    return {'msg': 'under development'}

@flights_api.route("/status", methods = ["POST"])
def update_flights_status():
    return {'msg': 'under development'}

@flights_api.route("/future", methods = ["GET"])
def get_future_flights():
    return {'msg': 'under development'}

@flights_api.route("/schedule", methods = ["GET"])
def get_scheduled_flights():
    return {'msg': 'under development'}