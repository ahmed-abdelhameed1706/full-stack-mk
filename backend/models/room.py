from . import db

class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(255), nullable=False, unique=True)
    name = db.Column(db.String(255), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    owner = db.relationship('User', back_populates='owned_rooms')
    messages = db.relationship('Message', back_populates='room')
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    users = db.relationship('UserRoom', secondary='user_room', back_populates='rooms')

