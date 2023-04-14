from flask import Blueprint, request, jsonify
import utility
from database import getdb
import json

comments_api = Blueprint("comments_api", __name__)


@comments_api.route("/", methods=["GET"])
def get_comments():
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

    with getdb() as mydb:
        cursor = mydb.cursor()
        cursor.execute(
            """
            SELECT email, comment, rating
                FROM rate
                WHERE airline_name = %(airline_name)s and 
                flight_number = %(flight_number)s and 
                departure_date_time = %(departure_date_time)s
            """,
            params,
        )

        result = cursor.fetchall()
        response = {"comments": []}
        for items in result:
            response["comments"].append({"author": items[0], "comment": items[1], "rating": items[2]})
    return response


@comments_api.route("/", methods=["PUT"])
def make_comments():
    body = utility.convertBody(
        json.loads(request.data.decode("UTF-8")),
        {
            "email": "email",
            "airline_name": "airline_name",
            "flight_number": "flight_number",
            "departure_date_time": "departure_date_time",
            "rating": "rating",
            "comment": "comment",
        },
        auto_date=True,
    )

    if body == False:
        return {"msg": "missing field"}, 422

    with getdb() as mydb:
        cursor = mydb.cursor()

        try:
            cursor.execute(
                """
                    INSERT INTO rate
                        VALUES (%(email)s, %(airline_name)s, %(flight_number)s,
                                %(departure_date_time)s, %(rating)s, %(comment)s
                                )
                """,
                body,
            )
        except:
            cursor.close()
            return {"msg": "invalid field"}, 409
        mydb.commit()
        cursor.close()

    return {"msg": "success"}
