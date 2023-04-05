from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from database import mydb

import utility

customers_api = Blueprint("customers_api", __name__)


@customers_api.route("/", methods=["GET"])
@jwt_required(locations="cookies")
def get_customer_info():
    params = utility.convertParams(request.args, {"type": "type", "username": "username"})

    identity = get_jwt_identity()
    if params["username"] != identity["username"]:
        return {"msg": "username not match"}, 401

    if params == False:
        return {"msg": "missing field"}, 422

    if params["type"] != identity["type"]:
        return {"msg": "wrong user type"}, 409

    if params["type"] == "customer":
        cursor = mydb.cursor()
        cursor.execute(
            """
            SELECT email, first_name, last_name, building_number,
                    street_name, apartment_number, city, state,
                    zip_code, passport_number, passport_expiration,
                    passport_country, date_of_birth
                FROM customer
                WHERE email=%(email)s
        """,
            {"email": params["username"]},
        )

        result = cursor.fetchall()

        (
            email,
            first_name,
            last_name,
            building_number,
            street_name,
            apartment_number,
            city,
            state,
            zip_code,
            passport_number,
            passport_expiration,
            passport_country,
            date_of_birth,
        ) = result[0]

        cursor.execute(
            """
                SELECT phone_number
                    FROM customer_phone_number
                    WHERE email = %(email)s
            """,
            {"email": params["username"]},
        )

        result = cursor.fetchall()
        cursor.close()

        phone_numbers = []
        for item in result:
            phone_numbers.append(item[0])

        return {
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "phone_numbers": phone_numbers,
            "address": {
                "building_number": building_number,
                "street_name": street_name,
                "apartment_number": apartment_number,
                "city": city,
                "state": state,
                "zip_code": zip_code,
            },
            "passport": {"number": passport_number, "expiration": passport_expiration, "country": passport_country},
            "date_of_birth": date_of_birth,
        }

    elif params["type"] == "staff":
        cursor = mydb.cursor()
        cursor.execute(
            """
                SELECT username, first_name, last_name,
                        date_of_birth, airline_name
                    FROM airline_staff
                    WHERE username=%(username)s
            """,
            params,
        )

        result = cursor.fetchall()

        (username, first_name, last_name, date_of_birth, airline_name) = result[0]

        cursor.execute(
            """
                SELECT phone_number
                    FROM airline_staff_phone_number
                    WHERE username = %(username)s
            """,
            params,
        )

        result = cursor.fetchall()

        phone_numbers = []
        for item in result:
            phone_numbers.append(item[0])

        cursor.execute(
            """
                SELECT email_address
                    FROM airline_staff_email_address
                    WHERE username = %(username)s
            """,
            params,
        )

        result = cursor.fetchall()
        cursor.close()

        emails = []
        for item in result:
            emails.append(item[0])

        return {
            "username": username,
            "first_name": first_name,
            "last_name": last_name,
            "phone_numbers": phone_numbers,
            "emails": emails,
            "date_of_birth": date_of_birth,
            "airline_name": airline_name,
        }

    return {"msg": "unknown type"}, 422


@customers_api.route("/all", methods=["GET"])
def get_customers():
    return {"msg": "under development"}


@customers_api.route("/frequent", methods=["GET"])
def get_frequent_customers():
    return {"msg": "under development"}
