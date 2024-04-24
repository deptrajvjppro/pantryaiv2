from flask import jsonify, request, abort, Blueprint
from models import User, PantryItem, Recipe, Favorite
from flask import current_app as app

backend = Blueprint('backend', __name__, url_prefix='/backend')

@backend.route('/search_user_by_email', methods=['GET'])
def search_user_by_email():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Email parameter is required'}), 400
    user = User.query.ficdlter_by(email=email).first()
    if user:
        return jsonify({'username': user.username, 'email': user.email}), 200
    else:
        return jsonify({'message': 'No user found with that email'}), 404

@backend.route('/delete_user_by_email', methods=['DELETE'])
def delete_user_by_email():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Email parameter is required'}), 400
    user = User.query.filter_by(email=email).first()
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    else:
        return jsonify({'message': 'No user found with that email to delete'}), 404

@backend.route('/search_recipe_by_name', methods=['GET'])
def search_recipe_by_name():
    name = request.args.get('name')
    if not name:
        return jsonify({'error': 'Name parameter is required'}), 400
    recipe = Recipe.query.filter_by(name=name).first()
    if recipe:
        return jsonify({'name': recipe.name, 'instructions': recipe.instructions}), 200
    else:
        return jsonify({'message': 'No recipe found with that name'}), 404

@backend.route('/delete_recipe_by_name', methods=['DELETE'])
def delete_recipe_by_name():
    name = request.args.get('name')
    if not name:
        return jsonify({'error': 'Name parameter is required'}), 400
    recipe = Recipe.query.filter_by(name=name).first()
    if recipe:
        db.session.delete(recipe)
        db.session.commit()
        return jsonify({'message': 'Recipe deleted successfully'}), 200
    else:
        return jsonify({'message': 'No recipe found with that name to delete'}), 404

@backend.route('/add_user', methods=['POST'])
def add_user():
    data = request.get_json()
    new_user = User(username=data['username'], email=data['email'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User added successfully'}), 201