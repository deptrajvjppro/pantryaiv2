import requests

base_url = 'http://127.0.0.1:5000/backend'

def search_user_by_email(email):
    return requests.get(f'{base_url}/search_user_by_email', params={'email': email})

def search_recipe_by_name(name):
    return requests.get(f'{base_url}/search_recipe_by_name', params={'name': name})

def add_user(username, email, password):
    user_data = {'username': username, 'email': email, 'password': password}
    return requests.post(f'{base_url}/add_user', json=user_data)

def add_recipe(name, instructions, user_id):
    recipe_data = {'name': name, 'instructions': instructions, 'user_id': user_id}
    return requests.post(f'{base_url}/add_recipe', json=recipe_data)

def add_pantry_item(name, expiry_date, user_id, quantity):
    pantry_item_data = {'name': name, 'expiry_date': expiry_date, 'user_id': user_id, 'quantity': quantity }
    return requests.post(f'{base_url}/add_pantry_item', json=pantry_item_data)

def delete_pantry_item(item_id):
    return requests.delete(f'{base_url}/delete_pantry_item', params={'item_id': item_id})

def get_pantry_items_by_UID(user_id):
    return requests.get(f'{base_url}/get_pantry_items_by_user', params={'user_id': user_id})


def login_user(email, password):
    login_data = {'email': email, 'password': password}
    response = requests.post(f'{base_url}/loginUser', json=login_data)
    return response.json()


# Example usages
if __name__ == '__main__':

    # PANTRY ITEMS
    print("Adding a new pantry item:")
    print(add_pantry_item('Vanilla Ice Cream', '2024-12-01', 1, 2))

    print("Searching for a pantry item by User ID:")
    print(get_pantry_items_by_UID(1))

    print("Searching for a pantry item by User ID:")
    get_pantry_items_by_UID(1)