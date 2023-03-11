from flask import Blueprint, request, jsonify

customers_api = Blueprint('customers_api', __name__)

@customers_api.route('/', methods=['GET'])
def get_customers():
    return {'msg': 'under development'}