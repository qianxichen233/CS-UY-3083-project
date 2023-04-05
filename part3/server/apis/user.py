from flask import Blueprint, request, jsonify, make_response
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    get_jwt_identity,
    unset_jwt_cookies,
    jwt_required,
    JWTManager,
    create_refresh_token,
    set_access_cookies,
    set_refresh_cookies,
)
import json
import bcrypt

import utility
from database import mydb

user_api = Blueprint("user_api", __name__)


@user_api.route("/login", methods=["POST"])
def login():
    body = utility.convertBody(
        json.loads(request.data.decode("UTF-8")),
        {"user_type": "user_type", "username": "username", "password": "password"},
    )

    if body == False:
        return {"msg": "missing field"}, 422

    cursor = mydb.cursor()

    if body["user_type"] == "customer":
        cursor.execute(
            """
            SELECT password, first_name, last_name
            FROM customer
            WHERE email=%(email)s
        """,
            {"email": body["username"]},
        )

        result = cursor.fetchall()
        cursor.close()
        users = []

        for p in result:
            users.append(p)

        if len(users) == 0:
            return {"msg": "unknown user"}, 401

        if not bcrypt.checkpw(body["password"].encode("utf-8"), users[0][0].encode("utf-8")):
            return {"msg": "wrong password"}, 401

        access_token = create_access_token(identity={"type": "customer", "username": body["username"]})
        refresh_token = create_refresh_token(identity={"type": "customer", "username": body["username"]})

        response = make_response(jsonify({"type": "customer", "first_name": users[0][1], "last_name": users[0][2]}))
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        response.headers["access-control-expose-headers"] = "Set-Cookie"
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "*"

        return response

    elif body["user_type"] == "staff":
        cursor.execute(
            """
            SELECT password, airline_name
            FROM airline_staff
            WHERE username=%(username)s
        """,
            {"username": body["username"]},
        )

        result = cursor.fetchall()
        cursor.close()
        user = []

        for p in result:
            user.append(p)

        if len(user) == 0:
            return {"msg": "unknown user"}, 401

        if not bcrypt.checkpw(body["password"].encode("utf-8"), user[0][0].encode("utf-8")):
            return {"msg": "wrong password"}, 401

        access_token = create_access_token(identity={"type": "staff", "username": body["username"]})
        refresh_token = create_refresh_token(identity={"type": "staff", "username": body["username"]})

        response = make_response(
            jsonify(
                {
                    "type": "staff",
                    "airline": user[0][1],
                }
            )
        )
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        response.headers["access-control-expose-headers"] = "Set-Cookie"
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "*"

        return response

    return {"msg": "unknown user type"}, 422


@user_api.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


@user_api.route("/register", methods=["POST"])
def register():
    body = request.json
    if body["register_type"] == "customer":
        body = utility.convertBody(
            body,
            {
                "email": "email",
                "phone_number": "phone_number",
                "first_name": "name.first_name",
                "last_name": "name.last_name",
                "password": "password",
                "building_number": "address.building_number",
                "street_name": "address.street_name",
                "apartment_number": "address.apartment_number",
                "city": "address.city",
                "state": "address.state",
                "zip_code": "address.zip_code",
                "passport_number": "passport.number",
                "passport_expiration": "passport.expiration",
                "passport_country": "passport.country",
                "date_of_birth": "date_of_birth",
            },
        )

        if body == False:
            return {"msg": "missing field"}, 422

        password = bcrypt.hashpw(body["password"].encode("utf-8"), bcrypt.gensalt())
        body["password"] = password

        cursor = mydb.cursor()

        try:
            cursor.execute(
                """
                SELECT email FROM customer WHERE email=%(email)s
            """,
                {"email": body["email"]},
            )

            if sum(1 for (_) in cursor) > 0:
                return {"msg": "email already exists"}, 409

            cursor.execute(
                """
                INSERT INTO customer VALUES (
                    %(email)s,
                    %(first_name)s,
                    %(last_name)s,
                    %(password)s,
                    %(building_number)s,
                    %(street_name)s,
                    %(apartment_number)s,
                    %(city)s,
                    %(state)s,
                    %(zip_code)s,
                    %(passport_number)s,
                    %(passport_expiration)s,
                    %(passport_country)s,
                    %(date_of_birth)s
                )
            """,
                body,
            )

            cursor.execute(
                """
                    INSERT INTO customer_phone_number
                        VALUES (
                            %(emails)s,
                            %(phone_number)s
                        )
                """,
                {"email": body["email"], "phone_number": body["phone_number"]},
            )
            mydb.commit()

        except:
            return {"msg": "unknown error"}, 500

        return {"msg": "success"}

    elif body["register_type"] == "staff":
        body = utility.convertBody(
            body,
            {
                "username": "username",
                "password": "password",
                "first_name": "name.first_name",
                "last_name": "name.last_name",
                "phone_number": "phone_number",
                "email": "email",
                "date_of_birth": "date_of_birth",
                "airline_name": "airline",
            },
        )

        if body == False:
            return {"msg": "missing field"}, 422

        password = bcrypt.hashpw(body["password"].encode("utf-8"), bcrypt.gensalt())
        body["password"] = password

        cursor = mydb.cursor()

        try:
            cursor.execute(
                """
                SELECT username FROM airline_staff WHERE username=%(username)s
            """,
                {"username": body["username"]},
            )

            if sum(1 for (_) in cursor) > 0:
                return {"msg": "user already exists"}, 409

            cursor.execute(
                """
                INSERT INTO airline_staff VALUES (
                    %(username)s,
                    %(password)s,
                    %(first_name)s,
                    %(last_name)s,
                    %(date_of_birth)s,
                    %(airline_name)s
                )
            """,
                body,
            )

            cursor.execute(
                """
                    INSERT INTO airline_staff_phone_number
                        VALUES (
                            %(username)s,
                            %(phone_number)s
                        )
                """,
                body,
            )

            cursor.execute(
                """
                    INSERT INTO airline_staff_email_address
                        VALUES (
                            %(username)s,
                            %(email)s
                        )
                """,
                body,
            )

            mydb.commit()

        except:
            return {"msg": "unknown error"}, 500

        return {"msg": "success"}

    else:
        return {"msg": "unknown user type"}, 422
