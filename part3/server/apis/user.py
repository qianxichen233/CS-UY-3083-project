from flask import Blueprint, request, jsonify, make_response
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager, \
                                create_refresh_token, set_access_cookies, set_refresh_cookies
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
    body = utility.convertBody(json.loads(request.data.decode('UTF-8')), {
        'user_type': 'user_type',
        'username': 'username',
        'password': 'password'
    })

    if(body == False):
        return {"msg": "missing field"}, 422

    cursor = mydb.cursor()

    if(body['user_type'] == 'customer'):
        cursor.execute("""
            SELECT password, first_name, last_name
            FROM customer
            WHERE email=%(email)s
        """, {
            'email': body['username']
        })

        result = cursor.fetchall()
        cursor.close()
        users = []

        for (p) in result:
            users.append(p)
        
        if(len(users) == 0):
            return {"msg": "unknown user"}, 401
        
        if(not bcrypt.checkpw(body['password'].encode('utf-8'), users[0][0].encode('utf-8'))):
            return {"msg": "wrong password"}, 401

        access_token = create_access_token(identity = body['username'])
        refresh_token = create_refresh_token(identity = body['username'])

        response = make_response(jsonify({
            'first_name': users[0][1],
            'last_name': users[0][2]
        }))
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        response.headers['access-control-expose-headers'] = 'Set-Cookie'
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Headers'] = '*'
        
        return response

    elif(body['user_type'] == 'staff'):
        cursor.execute("""
            SELECT password
            FROM airline_staff
            WHERE username=%(username)s
        """, {
            'username': body['username']
        })

        result = cursor.fetchall()
        cursor.close()
        password = []

        for (p) in result:
            password.append(p)
        
        if(len(password) == 0):
            return {"msg": "unknown user"}, 401
        
        if(not bcrypt.checkpw(body['password'], password[0])):
            return {"msg": "wrong password"}, 401

        access_token = create_access_token(identity = body['username'])
        refresh_token = create_refresh_token(identity = body['username'])

        response = make_response(jsonify({
            'first_name': users[0][1],
            'last_name': users[0][2]
        }))
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        response.headers['access-control-expose-headers'] = 'Set-Cookie'
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Headers'] = '*'
        
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
    if(body['register_type'] == 'customer'):
        body = utility.convertBody(body, {
            'email': 'email',
            'phone_number': "phone_number",
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
            return {'msg': 'missing field'}, 422

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
    
    elif(body['register_type'] == 'staff'):
        body = utility.convertBody(body, {
            'username': 'username',
            'password': 'password',
            'first_name': 'name.first_name',
            'last_name': 'name.last_name',
            'phone_number': "phone_number",
            'email': 'email',
            'date_of_birth': 'date_of_birth',
            'airline_name': 'airline'
        })

        if(body == False):
            return {'msg': 'missing field'}, 422

        password = bcrypt.hashpw(body['password'].encode('utf-8'), bcrypt.gensalt())
        body['password'] = password

        cursor = mydb.cursor()

        try:
            cursor.execute("""
                SELECT username FROM airline_staff WHERE username=%(username)s
            """, {
                'username': body['username']
            })

            if(sum(1 for (_) in cursor) > 0):
                return {"msg": "user already exists"}, 409

            cursor.execute("""
                INSERT INTO airline_staff VALUES (
                    %(username)s,
                    %(password)s,
                    %(first_name)s,
                    %(last_name)s,
                    %(date_of_birth)s,
                    %(airline_name)s
                )
            """, body)
            mydb.commit()

        except:
            return {"msg": "unknown error"}, 500
        
        return {"msg": "success"}
    
    else:
        return {"msg": "unknown user type"}, 422