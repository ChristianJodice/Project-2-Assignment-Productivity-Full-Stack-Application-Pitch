"""Application configuration."""
import os

class Config:
    """Base config. Use environment variables for production."""
    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev-secret-change-in-production"
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or "sqlite:///productivity.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
