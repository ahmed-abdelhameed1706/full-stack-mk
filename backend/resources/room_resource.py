from ..models import Room, db, User
from flask_restful import Resource, reqparse, fields, marshal_with, abort
from .message_resource import message_resource_fields

room_parser = reqparse.RequestParser()
room_parser.add_argument('name', type=str, required=False)
room_parser.add_argument('owner', type=int, required=False)
room_parser.add_argument('user', type=int, required=False)



def generate_code(n):
    import random
    import string
    code = ''
    while True:
        code = ''.join(random.choices(string.ascii_uppercase + string.digits + string.ascii_lowercase, k=n))
        if not Room.query.filter_by(code=code).first():
            break
    return code


room_resource_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'code': fields.String,
    'created_at': fields.DateTime,
    'owner': fields.Nested({
        'id': fields.Integer,
        'name': fields.String,
        'session_id': fields.String,
    }),
    'messages': fields.List(fields.Nested(message_resource_fields)),
    'users': fields.List(fields.Nested({
        'id': fields.Integer,
        'name': fields.String,
        'session_id': fields.String,
    })),
}

class RoomResource(Resource):
    @marshal_with(room_resource_fields)
    def get(self, code):
        room = Room.query.filter_by(code=code).first()
        if not room:
            abort(404, message="Room {} doesn't exist".format(code))
        return room

    def delete(self, code):
        room = Room.query.filter_by(code=code).first()

        for user in room.users:
            user.rooms.remove(room)
            db.session.commit()

        for _ in room.users:
            room.users.pop()
            db.session.commit()

        for message in room.messages:
            db.session.delete(message)
            db.session.commit()

        db.session.delete(room)
        db.session.commit()
        return '', 204
    
    
    @marshal_with(room_resource_fields)
    def put(self, code=None):
        if code:
            args = room_parser.parse_args()
            room = Room.query.filter_by(code=code).first()
            if not room:
                abort(404, message="Room {} doesn't exist".format(code))
            user_id = args['user'] 
            user = User.query.filter_by(id=user_id).first()
            
            room.users.append(user)
            user.rooms.append(room)
            db.session.commit()
            return room, 200
        else:
            args = room_parser.parse_args()
            name = args['name'] 
            code = generate_code(4)
            
            owner_id = args['owner']
            owner = User.query.filter_by(id=owner_id).first()

            room = Room(name=name, code=code, owner=owner)
            db.session.add(room)
            db.session.commit()

            user_id = args['user'] 
            user = User.query.filter_by(id=user_id).first()

            if user in room.users:
                return room, 200

            room.users.append(user)
            user.rooms.append(room)
            user.owned_rooms.append(room)
            db.session.commit()
            return room, 201
    

class RoomListResource(Resource):
    @marshal_with(room_resource_fields)
    def get(self):
        rooms = Room.query.all()
        return rooms
    

class RoomMessageListResource(Resource):
    @marshal_with(message_resource_fields)
    def get(self, code):
        room = Room.query.filter_by(code=code).first()
        if not room:
            abort(404, message="Room {} doesn't exist".format(id))
            
        return room.messages
    
class RoomUserListResource(Resource):
    @marshal_with(room_resource_fields)
    def get(self, code):
        room = Room.query.filter_by(code=code).first()
        if not room:
            abort(404, message="Room {} doesn't exist".format(id))
        return room.users