from flask import Flask
from flask_restful import Api
from flask_migrate import Migrate
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'

    from .routes import main
    app.register_blueprint(main, url_prefix='/')

    api = Api(app)
    CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "*"}})

    from .resources import MessageResource, MessageListResource
    from .resources import RoomResource, RoomListResource, RoomMessageListResource, RoomUserListResource
    from .resources import UserResource, UserListResource, UserMessageListResource, UserRoomListResource

    #Message API endpoints 
    api.add_resource(MessageResource, '/api/messages', '/api/messages/<int:id>')
    api.add_resource(MessageListResource, '/api/all-messages', endpoint='get_all_messages')

    #Room API endpoints
    api.add_resource(RoomResource,'/api/room', '/api/rooms/<string:code>', '/api/room/<string:code>', endpoint='get_room')
    api.add_resource(RoomMessageListResource, '/api/rooms/<string:code>/messages', endpoint='get_room_messages')
    api.add_resource(RoomUserListResource, '/api/rooms/<string:code>/users', endpoint='get_room_users')
    api.add_resource(RoomListResource, '/api/rooms', endpoint='get_all_rooms')

    #User API endpoints
    api.add_resource(UserResource, '/api/user', '/api/users/<string:id>', endpoint='get_user')
    api.add_resource(UserMessageListResource, '/api/users/<int:id>/messages', endpoint='get_user_messages')
    api.add_resource(UserRoomListResource, '/api/users/<int:id>/rooms', endpoint='get_user_rooms')
    api.add_resource(UserListResource, '/api/users', endpoint='get_all_users')

    from .models import db

    db.init_app(app)
    with app.app_context():
        db.create_all()

    migrate = Migrate(app, db)

    return app