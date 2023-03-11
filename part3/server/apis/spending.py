from flask import Blueprint, request, jsonify

spending_api = Blueprint('spending_api', __name__)

@spending_api.route('/', methods=['GET'])
def get_spending():
    return {'msg': 'under development'}