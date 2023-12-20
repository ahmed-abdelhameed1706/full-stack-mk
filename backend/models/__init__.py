from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

user_room = db.Table('user_room',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('room_id', db.Integer, db.ForeignKey('room.id'))
)

from .user import User
from .room import Room
from .message import Message



