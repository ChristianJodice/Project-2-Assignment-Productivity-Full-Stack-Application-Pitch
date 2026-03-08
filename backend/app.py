"""Flask application entry point."""
import os
from flask import Flask
from flask_cors import CORS

from config import Config
from models import db, bcrypt

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Allow credentials (cookies) for session auth; adjust origins for production
    CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

    db.init_app(app)
    bcrypt.init_app(app)

    with app.app_context():
        db.create_all()

    from routes.auth import auth_bp
    from routes.projects import projects_bp
    from routes.tasks import tasks_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(projects_bp, url_prefix="/api/projects")
    app.register_blueprint(tasks_bp, url_prefix="/api/projects")

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
