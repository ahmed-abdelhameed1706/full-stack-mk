from . import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    session_id = db.Column(db.String(255), nullable=False)
    messages = db.relationship('Message', back_populates='user')
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    rooms = db.relationship('UserRoom', secondary='user_room', back_populates='users')
    owned_rooms = db.relationship('Room', back_populates='owner', lazy='dynamic')
