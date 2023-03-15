from flask import Blueprint, request, jsonify

revenue_api = Blueprint('revenue_api', __name__)

@revenue_api.route('/', methods=['GET'])
def get_revenue():
    return {'msg': 'under development'}