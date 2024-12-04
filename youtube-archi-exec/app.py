from flask import Flask, render_template
from flask_cors import CORS
import redis
from flask_socketio import SocketIO
import time


app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173"], # Ajustez selon votre port frontend
        "allow_headers": ["Content-Type"],
        "methods": ["GET", "POST", "OPTIONS"]
    }
})
socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

import routes.evaluate_channel

if __name__ == '__main__':
    socketio.run(app)