from ..models import User, db
from flask_restful import Resource, reqparse, fields, marshal_with, abort
from .message_resource import message_resource_fields
from .room_resource import room_resource_fields


user_parser = reqparse.RequestParser()
user_parser.add_argument('name', type=str, required=True)
user_parser.add_argument('session_id', type=str, required=True)

user_resource_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'created_at': fields.DateTime,
    'session_id': fields.String,
}

class UserResource(Resource):
    @marshal_with(user_resource_fields)
    def get(self, id):
        user = User.query.filter_by(session_id=id).first()
        if not user:
            abort(404, message="User {} doesn't exist".format(id))
        return user

    def delete(self, id):
        user = User.query.filter_by(id=id).first()
        db.session.delete(user)
        db.session.commit()
        return '', 204
    
    
    @marshal_with(user_resource_fields)
    def put(self):
        args = user_parser.parse_args()
        session_id = args['session_id']
        name = args['name']
        user = User(name=name, session_id=session_id)
        db.session.add(user)
        db.session.commit()
        return user, 201
    

    @marshal_with(user_resource_fields)
    def post(self):
        args = user_parser.parse_args()
        session_id = args['session_id']
        name = args['name']
        user = User(name=name, session_id=session_id)
        db.session.add(user)
        db.session.commit()
        return user, 201

    @marshal_with(user_resource_fields)
    def patch(self, id):
        user = User.query.filter_by(session_id=id).first()
        if not user:
            abort(404, message="User {} doesn't exist".format(id))
        args = user_parser.parse_args()
        name = args['name']
        user.name = name
        db.session.commit()
        return user, 201
    
class UserRoomListResource(Resource):
    @marshal_with(room_resource_fields)
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            abort(404, message="User {} doesn't exist".format(id))
            
        return user.rooms
    
class UserMessageListResource(Resource):
    @marshal_with(message_resource_fields)
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            abort(404, message="User {} doesn't exist".format(id))
            
        return user.messages

class UserListResource(Resource):
    @marshal_with(user_resource_fields)
    def get(self):
        users = User.query.all()
        return users