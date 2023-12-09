from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User
from .room import Room
from .message import Message

class UserRoom(db.Model):
    __tablename__ = 'user_room'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=False)
    user = db.relationship('User', back_populates='rooms')
    room = db.relationship('Room', back_populates='users')

User.rooms = db.relationship('UserRoom', back_populates='user')
Room.users = db.relationship('UserRoom', back_populates='room')