from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
import json
import bcrypt

import utility
from database import mydb

user_api = Blueprint('user_api', __name__)

@user_api.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response
    
@user_api.route('/login', methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    #bcrypt.checkpw(password, hash)
    if username != "test" or password != "test":
        return {"msg": "Wrong email or password"}, 401

    access_token = create_access_token(identity = username)
    response = {"access_token":access_token}
    return response

@user_api.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

@user_api.route("/register", methods=["POST"])
def register():
    body = request.json
    body = utility.convertBody(body, {
        'email': 'email',
        'first_name': 'name.first_name',
        'last_name': 'name.last_name',
        'password': 'password',
        'building_number': 'address.building_number',
        'street_name': 'address.street_name',
        'apartment_number': 'address.apartment_number',
        'city': 'address.city',
        'state': 'address.state',
        'zip_code': 'address.zip_code',
        'passport_number': 'passport.number',
        'passport_expiration': 'passport.expiration',
        'passport_country': 'passport.country',
        'date_of_birth': 'date_of_birth'
    })

    if(body == False):
        return {'msg': 'Incomplete body'}, 422

    password = bcrypt.hashpw(body['password'].encode('utf-8'), bcrypt.gensalt())
    body['password'] = password

    cursor = mydb.cursor()

    try:
        cursor.execute("""
            SELECT email FROM customer WHERE email=%(email)s
        """, {
            'email': body['email']
        })

        if(sum(1 for (_) in cursor) > 0):
            return {"msg": "email already exists"}, 409

        cursor.execute("""
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
        """, body)
        mydb.commit()

    except:
        return {"msg": "unknown error"}, 500
    
    return {"msg": "success"}