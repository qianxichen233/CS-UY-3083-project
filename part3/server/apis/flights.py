from flask import Blueprint, request, jsonify

flights_api = Blueprint('flights_api', __name__)

@flights_api.route("/", methods = ["GET"])
def get_flights():
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

@flights_api.route("/rating", methods = ["GET"])
def get_flight_comments():
    return {'msg': 'under development'}