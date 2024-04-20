from app import create_app, db
from models import User, PantryItem, Recipe, Favorite
from datetime import datetime

app = create_app()

def add_user(username, password, email):
    with app.app_context():
        if User.query.filter_by(email=email).first() is None:
            user = User(username=username, password=password, email=email)
            db.session.add(user)
            db.session.commit()
            print(f'Added user {username}')
        else:
            print(f'User with email {email} already exists')

def delete_user(email):
    with app.app_context():
        user = User.query.filter_by(email=email).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            print(f'Deleted user with email {email}')
        else:
            print(f'User with email {email} not found')

def add_recipe(name, instructions, pantry_item_id):
    with app.app_context():
        recipe = Recipe(name=name, instructions=instructions, pantry_item_id=pantry_item_id)
        db.session.add(recipe)
        db.session.commit()
        print(f'Added recipe {name}')

def delete_recipe(name):
    with app.app_context():
        recipe = Recipe.query.filter_by(name=name).first()
        if recipe:
            db.session.delete(recipe)
            db.session.commit()
            print(f'Deleted recipe {name}')
        else:
            print(f'Recipe {name} not found')

def search_recipe(name):
    with app.app_context():
        recipe = Recipe.query.filter_by(name=name).first()
        if recipe:
            print(f'Found recipe: {recipe.name} - {recipe.instructions}')
        else:
            print(f'No recipe found with name {name}')

if __name__ == '__main__':
    add_user('alice_doe', 'secure123', 'alice@example.com')
    delete_user('jane@example.com')
    add_recipe('Carbonara', 'Cook pasta and mix with eggs and bacon', 1)
    delete_recipe('Tomato Soup')
    search_recipe('Spaghetti')
