from flask import Blueprint, request, jsonify

import utility
import json

from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required

from database import mydb

flights_api = Blueprint('flights_api', __name__)

@flights_api.route("/", methods = ["GET"])
#@jwt_required(locations='cookies')
def get_flights():
    params = utility.convertParams(request.args, {
        "airline": "airline",
        "start_date?": "start_date",
        "end_date?":"end_date",
        "source_city?":"source_city",
        "source_airport?":"source_airport",
        "destination_city?":"destination_city",
        "destination_airport?":"destination_airport"
    })

    if(params == False):
        return {"msg", "missing field"}, 422
    
    cursor = mydb.cursor()
    cursor.execute("""
            SELECT airline, start_date, end_date, source_city,
                    source_airport, destination_city, destination_airport
                FROM flight
                WHERE airline_name=%(airline)s
        """, {
            "airline": params['airline']
        })

    return {'msg': 'under development'}

@flights_api.route("/", methods = ["PUT"])
def create_flights():
    return {'msg': 'under development'}

@flights_api.route("/status", methods = ["GET"])
def get_flights_status():
    params = utility.convertParams(request.args, {
        "airline_name": "airline_name",
        "flight_number": "flight_number",
        "departure_date":"departure_date_time",
    })

    if(params == False):
        return {"msg": "missing field"}, 422
    
    
    cursor = mydb.cursor()
    cursor.execute("""
            SELECT airline_name,flight_number,departure_date_time,departure_airport_code,
                arrival_date_time,arrival_airport_code,base_price,status,id, seat_number,
		        manufacturing_company,manufacturing_date, age
                FROM flight natural join airplane
                WHERE airline_name=%(airline)s and flight_number=%(flightnum)s and departure_date_time=%(de_date)s
                and airplane.ID = airplane_ID
        """, {
            "airline": params['airline_name'],
            "flightnum": params['flight_number'], 
            "de_date": params["departure_date"]
        })
    
    result = cursor.fetchall()
    items = result[0]
    
    response = {
        'airline_name': items[0],
        "flight_number": items[1],
        "departure_date_time":items[2],
	    "departure_airport_code" :items[3],
	    "arrival_date_ti":items[4],
	    "arrival_airport_code":items[5],
	    "base_price":items[6],
	    "status":items[7],
        "airplane": {
            "id":items[8],
            "seat_number":items[9],
            "manufacturing_company":items[10],
            "manufacturing_date":items[11],
            "age":items[12]
        }
    }

    return response

@flights_api.route("/status", methods = ["POST"])
def update_flights_status():
    return {'msg': 'under development'}

@flights_api.route("/future", methods = ["GET"])
def get_future_flights():
    return {'msg': 'under development'}

@flights_api.route("/schedule", methods = ["GET"])
def get_scheduled_flights():
    return {'msg': 'under development'}