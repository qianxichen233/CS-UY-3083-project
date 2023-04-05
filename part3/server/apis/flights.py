from flask import Blueprint, request, jsonify

import utility
import json

from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required

from database import mydb
from constant import valid_status

flights_api = Blueprint("flights_api", __name__)


@flights_api.route("/", methods=["GET"])
# @jwt_required(locations='cookies')
def get_flights():
    params = utility.convertParams(
        request.args,
        {
            "airline": "airline",
            "start_date?": "start_date",
            "end_date?": "end_date",
            "source_city?": "source_city",
            "source_airport?": "source_airport",
            "destination_city?": "destination_city",
            "destination_airport?": "destination_airport",
        },
    )

    if params == False:
        return {"msg", "missing field"}, 422

    selector = utility.createSqlQuery(
        [
            {"name": "airline", "selector": "airline_name = %s"},
            {"name": "start_date", "selector": "departure_date_time > %s"},
            {"name": "end_date", "selector": "departure_date_time < %s"},
            {"name": "source_city", "selector": "departure.city = %s"},
            {"name": "destination_city", "selector": "arrival.city = %s"},
            {"name": "source_airport", "selector": "departure_airport_code = %s"},
            {"name": "destination_airport", "selector": "arrival_airport_code = %s"},
        ],
        params,
    )

    cursor = mydb.cursor()
    cursor.execute(
        """
            SELECT airline_name, flight_number, departure_date_time, departure_airport_code,
                    arrival_date_time, arrival_airport_code, base_price, status,
                    id, seat_number, manufacturing_company, manufacturing_date, age
                FROM flight NATURAL JOIN airplane JOIN airport AS arrival JOIN airport AS departure
                WHERE airplane.ID = airplane_ID
                    AND arrival.code = arrival_airport_code
                    AND departure.code = departure_airport_code
                    {selector}
        """.format(
            selector=selector
        ),
        params,
    )

    result = cursor.fetchall()

    response = {"flights": []}

    for item in result:
        response["flights"].append(
            {
                "airline_name": item[0],
                "flight_number": item[1],
                "departure_date_time": item[2],
                "departure_airport_code": item[3],
                "arrival_date_time": item[4],
                "arrival_airport_code": item[5],
                "base_price": item[6],
                "status": item[7],
                "airplane": {
                    "id": item[8],
                    "seat_number": item[9],
                    "manufacturing_company": item[10],
                    "manufacturing_date": item[11],
                    "age": item[12],
                },
            }
        )

    return response


@flights_api.route("/", methods=["PUT"])
def create_flights():
    body = utility.convertBody(
        json.loads(request.data.decode("UTF-8")),
        {
            "airline_name": "airline_name",
            "flight_number": "flight_number",
            "departure_date_time": "departure_date_time",
            "departure_airport_code": "departure_airport_code",
            "arrival_date_time": "arrival_date_time",
            "arrival_airport_code": "arrival_airport_code",
            "base_price": "base_price",
            "airplane_ID": "airplane_id",
        },
        auto_date=True,
    )

    if body == False:
        return {"msg": "missing field"}, 422

    cursor = mydb.cursor()

    cursor.execute(
        """
            INSERT INTO flight
                VALUES (%(airline_name)s, %(flight_number)s, %(departure_date_time)s,
                        %(departure_airport_code)s, %(arrival_date_time)s, %(arrival_airport_code)s,
                        %(base_price)s, %(airplane_ID)s, "scheduled");
        """,
        body,
    )

    mydb.commit()

    # result = cursor.fetchall()
    # print(result)

    return {"msg": "success"}


@flights_api.route("/status", methods=["GET"])
def get_flights_status():
    params = utility.convertParams(
        request.args,
        {
            "airline_name": "airline_name",
            "flight_number": "flight_number",
            "departure_date_time": "departure_date_time",
        },
        auto_date=True,
    )

    if params == False:
        return {"msg": "missing field"}, 422

    print(params)

    cursor = mydb.cursor()
    cursor.execute(
        """
            SELECT airline_name,flight_number,departure_date_time,departure_airport_code,
                arrival_date_time,arrival_airport_code,base_price,status,id, seat_number,
		        manufacturing_company,manufacturing_date, age
                FROM flight NATURAL JOIN airplane
                WHERE airline_name=%(airline_name)s
                    AND flight_number=%(flight_number)s
                    AND departure_date_time=%(departure_date_time)s
                    AND airplane.ID = airplane_ID
        """,
        params,
    )

    result = cursor.fetchall()
    if len(result) == 0:
        return {"msg": "flight not exist"}, 404

    items = result[0]

    response = {
        "airline_name": items[0],
        "flight_number": items[1],
        "departure_date_time": items[2],
        "departure_airport_code": items[3],
        "arrival_date_time": items[4],
        "arrival_airport_code": items[5],
        "base_price": items[6],
        "status": items[7],
        "airplane": {
            "id": items[8],
            "seat_number": items[9],
            "manufacturing_company": items[10],
            "manufacturing_date": items[11],
            "age": items[12],
        },
    }

    return response


@flights_api.route("/status", methods=["POST"])
def update_flights_status():
    body = utility.convertBody(
        json.loads(request.data.decode("UTF-8")),
        {
            "status": "status",
            "airline_name": "airline_name",
            "flight_number": "flight_number",
            "departure_date_time": "departure_date_time",
        },
        auto_date=True,
    )

    if body == False:
        return {"msg": "missing field"}, 422

    cursor = mydb.cursor()

    cursor.execute(
        """
            SELECT *
                FROM flight
                WHERE airline_name = %(airline_name)s
                    AND flight_number = %(flight_number)s
                    AND departure_date_time = %(departure_date_time)s
        """,
        body,
    )

    result = cursor.fetchall()
    if len(result) == 0:
        return {"msg": "flight not found"}, 404

    if body["status"] not in valid_status:
        return {"msg": "status not exist"}, 409

    cursor.execute(
        """
            UPDATE flight
                SET status = %(status)s
                WHERE airline_name = %(airline_name)s
                    AND flight_number = %(flight_number)s
                    AND departure_date_time = %(departure_date_time)s
        """,
        body,
    )

    mydb.commit()

    return {"msg": "success"}


@flights_api.route("/future", methods=["GET"])
def get_future_flights():
    params = utility.convertParams(
        request.args,
        {
            "source_city?": "source_city",
            "source_airport?": "source_airport",
            "destination_city?": "destination_city",
            "destination_airport?": "destination_airport",
            "departure_date": "departure_date",
            "return_date?": "return_date",
        },
    )

    if params == False:
        return {"msg": "missing field"}, 422

    if "source_city" not in params and "source_airport" not in params:
        return {"msg": "missing field"}, 422

    if "destination_city" not in params and "destination_airport" not in params:
        return {"msg": "missing field"}, 422

    selector_to = utility.createSqlQuery(
        [
            {"name": "source_city", "selector": "departure.city = %s"},
            {"name": "source_airport", "selector": "departure_airport_code = %s"},
            {"name": "destination_city", "selector": "arrival.city = %s"},
            {"name": "destination_airport", "selector": "arrival_airport_code = %s"},
            {"name": "departure_date", "selector": "DATE(departure_date_time) = %s"},
        ],
        params,
    )

    cursor = mydb.cursor()

    cursor.execute(
        """
        SELECT airline_name, flight_number, departure_date_time, departure_airport_code,
                    arrival_date_time, arrival_airport_code, base_price, status,
                    id, seat_number, manufacturing_company, manufacturing_date, age
                FROM flight NATURAL JOIN airplane JOIN airport AS arrival JOIN airport AS departure
                WHERE airplane.ID = airplane_ID
                    AND arrival.code = arrival_airport_code
                    AND departure.code = departure_airport_code
                    {selector_to}
        """.format(
            selector_to=selector_to
        ),
        params,
    )

    response = {"flights_to": []}

    result = cursor.fetchall()

    for item in result:
        response["flights_to"].append(
            {
                "airline_name": item[0],
                "flight_number": item[1],
                "departure_date_time": item[2],
                "departure_airport_code": item[3],
                "arrival_date_time": item[4],
                "arrival_airport_code": item[5],
                "base_price": item[6],
                "status": item[7],
                "airplane": {
                    "id": item[8],
                    "seat_number": item[9],
                    "manufacturing_company": item[10],
                    "manufacturing_date": item[11],
                    "age": item[12],
                },
            }
        )

    if "return_date" in params and params["return_date"] != None:
        selector_back = utility.createSqlQuery(
            [
                {"name": "destination_city", "selector": "departure.city = %s"},
                {"name": "destination_airport", "selector": "departure_airport_code = %s"},
                {"name": "source_city", "selector": "arrival.city = %s"},
                {"name": "source_airport", "selector": "arrival_airport_code = %s"},
                {"name": "return_date", "selector": "DATE(departure_date_time) = %s"},
            ],
            params,
        )

        cursor.execute(
            """
            SELECT airline_name, flight_number, departure_date_time, departure_airport_code,
                        arrival_date_time, arrival_airport_code, base_price, status,
                        id, seat_number, manufacturing_company, manufacturing_date, age
                    FROM flight NATURAL JOIN airplane JOIN airport AS arrival JOIN airport AS departure
                    WHERE airplane.ID = airplane_ID
                        AND arrival.code = arrival_airport_code
                        AND departure.code = departure_airport_code
                        {selector_back}
            """.format(
                selector_back=selector_back
            ),
            params,
        )

        response["flights_from"] = []

        result = cursor.fetchall()

        for item in result:
            response["flights_from"].append(
                {
                    "airline_name": item[0],
                    "flight_number": item[1],
                    "departure_date_time": item[2],
                    "departure_airport_code": item[3],
                    "arrival_date_time": item[4],
                    "arrival_airport_code": item[5],
                    "base_price": item[6],
                    "status": item[7],
                    "airplane": {
                        "id": item[8],
                        "seat_number": item[9],
                        "manufacturing_company": item[10],
                        "manufacturing_date": item[11],
                        "age": item[12],
                    },
                }
            )

    return response


@flights_api.route("/schedule", methods=["GET"])
def get_scheduled_flights():
    return {"msg": "under development"}
