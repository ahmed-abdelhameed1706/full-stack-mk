from flask import Flask
from flask_restful import Api
from flask_migrate import Migrate


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'

    from .routes import main
    app.register_blueprint(main, url_prefix='/')

    api = Api(app)

    from .resources import MessageResource
    from .resources import RoomResource, RoomListResource, RoomMessageListResource, RoomUserListResource
    from .resources import UserResource, UserListResource, UserMessageListResource, UserRoomListResource

    api.add_resource(MessageResource, '/api/messages', '/api/messages/<int:id>')

    api.add_resource(RoomResource,'/api/room', '/api/rooms/<int:id>', endpoint='get_room')
    api.add_resource(RoomMessageListResource, '/api/rooms/<int:id>/messages', endpoint='get_room_messages')
    api.add_resource(RoomUserListResource, '/api/rooms/<int:id>/users', endpoint='get_room_users')
    api.add_resource(RoomListResource, '/api/rooms', endpoint='get_all_rooms')

    api.add_resource(UserResource, '/api/user', '/api/users/<int:id>', endpoint='get_user')
    api.add_resource(UserMessageListResource, '/api/users/<int:id>/messages', endpoint='get_user_messages')
    api.add_resource(UserRoomListResource, '/api/users/<int:id>/rooms', endpoint='get_user_rooms')
    api.add_resource(UserListResource, '/api/users', endpoint='get_all_users')

    from .models import db

    db.init_app(app)
    with app.app_context():
        db.create_all()

    migrate = Migrate(app, db)

    return app