from flask import Blueprint, request, jsonify

tickets_api = Blueprint('tickets_api', __name__)

@tickets_api.route('/', methods=['GET'])
def get_tickets():
    return {'msg': 'under development'}

@tickets_api.route('/price', methods=['GET'])
def get_ticket_price():
    return {'msg': 'under development'}

@tickets_api.route('/register', methods=['PUT'])
def create_new_ticket():
    return {'msg': 'under development'}

@tickets_api.route('/unregister', methods=['POST'])
def delete_ticket():
    return {'msg': 'under development'}