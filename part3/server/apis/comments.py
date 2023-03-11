from flask import Blueprint, request, jsonify

comments_api = Blueprint('comments_api', __name__)

@comments_api.route('/', methods=['GET'])
def get_comments():
    return {'msg': 'under development'}

@comments_api.route('/', methods=['PUT'])
def make_comments():
    return {'msg': 'under development'}