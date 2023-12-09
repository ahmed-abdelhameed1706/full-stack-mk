from . import db

class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(255), nullable=False, unique=True)
    name = db.Column(db.String(255), nullable=False)
    messages = db.relationship('Message', back_populates='room')
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    users = db.relationship('User', secondary='user_room', back_populates='rooms')

