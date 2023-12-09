from ..models import Room, db
from flask_restful import Resource, reqparse, fields, marshal_with, abort
from .message_resource import message_resource_fields

room_parser = reqparse.RequestParser()
room_parser.add_argument('name', type=str, required=True)
room_parser.add_argument('code', type=str, required=True)


room_resource_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'code': fields.String,
    'created_at': fields.DateTime,
}

class RoomResource(Resource):
    @marshal_with(room_resource_fields)
    def get(self, id):
        room = Room.query.filter_by(id=id).first()
        return room

    def delete(self, id):
        room = Room.query.filter_by(id=id).first()
        db.session.delete(room)
        db.session.commit()
        return '', 204
    
    
    @marshal_with(room_resource_fields)
    def put(self):
        args = room_parser.parse_args()
        name = args['name']
        code = args['code']
        room = Room(name=name, code=code)
        db.session.add(room)
        db.session.commit()
        return room, 201
    

class RoomListResource(Resource):
    @marshal_with(room_resource_fields)
    def get(self):
        rooms = Room.query.all()
        return rooms
    

class RoomMessageListResource(Resource):
    @marshal_with(message_resource_fields)
    def get(self, id):
        room = Room.query.filter_by(id=id).first()
        if not room:
            abort(404, message="Room {} doesn't exist".format(id))
            
        return room.messages
    
class RoomUserListResource(Resource):
    @marshal_with(room_resource_fields)
    def get(self, id):
        room = Room.query.filter_by(id=id).first()
        if not room:
            abort(404, message="Room {} doesn't exist".format(id))
        return room.users