from flask import Blueprint, request, jsonify

airplane_api = Blueprint('airplane_api', __name__)

@airplane_api.route('/', methods=['PUT'])
def create_airplanes():
    return {'msg': 'under development'}