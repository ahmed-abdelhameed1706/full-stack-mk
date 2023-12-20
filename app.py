from backend import create_app
from flask_socketio import SocketIO, emit, join_room, leave_room

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
    emit('user_connected', {'user': data['user']}, room=room)

@socketio.on('leave_room')
def handle_leave_room(data):
    room = data['room']
    leave_room(room)
    emit('user_disconnected', {'userId': data['userId']}, room=room)

@socketio.on('send_message')
def handle_send_message(data):
    room = data['room']
    emit('receive_message', {'message': data['message'], 'user': data['user']}, room=room)

if __name__ == '__main__':
    socketio.run(app, debug=True)