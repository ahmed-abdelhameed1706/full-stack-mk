from backend import create_app
from flask_socketio import SocketIO, emit, join_room, leave_room
from backend.models import db, User, Room, Message

app = create_app()

socketio = SocketIO(app, cors_allowed_origins='*')


@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('join_room')
def handle_join_room(data):
    room = data['room']
    join_room(room)
    print('User ' + data['user'] + ' joined room ' + room)
    emit('user_connected', {'user': data['user'], 'userId': data['userId'] }, room=room)

@socketio.on('leave_room')
def handle_leave_room(data):
    room = data['room']
    leave_room(room)
    print('User ' + str(data['userId']) + ' left room ' + room)
    emit('user_disconnected', {'userId': data['userId']}, room=room)

@socketio.on('send_message')
def handle_send_message(data):
    room = data['room']
    user = data['user']
    message_content = data['message']

    userId = data['userId']

    userObject = User.query.filter_by(id=userId).first()
    roomObject = Room.query.filter_by(code=room).first()

    print('User ' + user + ' sent message ' + message_content + ' to room ' + room)
    message = Message(content=message_content, user=userObject, room=roomObject, user_id=userId, room_id=roomObject.id)
    db.session.add(message)
    db.session.commit()
    emit('receive_message', {'message': data['message'], 'user': data['user']}, room=room)

@socketio.on('get_existing_users')
def handle_get_existing_users(data):
    room = data['room']
    roomObject = Room.query.filter_by(code=room).first()
    users = roomObject.users
    
    emit('existing_users', {'users': [{'id': user.id, 'name': user.name} for user in users]}, room=room)

if __name__ == '__main__':
    socketio.run(app, debug=True)