from ..models import Message, db
from flask_restful import Resource, reqparse, fields, marshal_with


message_parser = reqparse.RequestParser()
message_parser.add_argument('content', type=str, required=True)
message_parser.add_argument('user_id', type=int, required=True)
message_parser.add_argument('room_id', type=int, required=True)

message_resource_fields = {
    'id': fields.Integer,
    'content': fields.String,
    'user_id': fields.Integer,
    'room_id': fields.Integer,
    'created_at': fields.DateTime,
    'updated_at': fields.DateTime,
    'user': fields.Nested({
        'id': fields.Integer,
        'name': fields.String,
        'session_id': fields.String,
    }),
    'room': fields.Nested({
        'id': fields.Integer,
        'name': fields.String,
        'code': fields.String,
        'created_at': fields.DateTime,}),
}


class MessageResource(Resource):
    @marshal_with(message_resource_fields)
    def get(self, id):
        message = Message.query.filter_by(id=id).first()
        return message
    
    def delete(self, id):
        message = Message.query.filter_by(id=id).first()
        db.session.delete(message)
        db.session.commit()
        return '', 204
    
    @marshal_with(message_resource_fields)
    def patch(self, id):
        message = Message.query.filter_by(id=id).first()
        args = message_parser.parse_args()
        message.content = args['content']
        message.updated_at = db.func.now()
        db.session.commit()
        return message, 201
    
    @marshal_with(message_resource_fields)
    def put(self):
        args = message_parser.parse_args()
        content = args['content']
        user_id = args['user_id']
        room_id = args['room_id']
        message = Message(content=content, user_id=user_id, room_id=room_id)
        db.session.add(message)
        db.session.commit()
        return message, 201
    

class MessageListResource(Resource):
    @marshal_with(message_resource_fields)
    def get(self):
        messages = Message.query.all()
        return messages

