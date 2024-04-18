# models.py
from flask_sqlalchemy import SQLAlchemy
import datetime


db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    pantry_items = db.relationship('PantryItem', backref='user', lazy=True)
    favorites = db.relationship('Favorite', backref='user', lazy=True)


class PantryItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    expiry_date = db.Column(db.DateTime, default=datetime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # Ensure this points to 'user.id'


class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    pantry_item_id = db.Column(db.Integer, db.ForeignKey('pantry_item.id'))

class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)
    # Additional fields and relationships as necessary

# Add additional classes for other tables like OpenFoodFactsCache etc. here.
