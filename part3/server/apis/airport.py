from flask import Blueprint, request, jsonify

airport_api = Blueprint('airport_api', __name__)

@airport_api.route('/', methods=['PUT'])
def add_airport():
    return {'msg': 'under development'}