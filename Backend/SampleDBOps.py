import requests

base_url = 'http://127.0.0.1:5000/backend'

# def get_pantry_items_by_user(user_id):
#     return requests.get(f'{base_url}/get_pantry_items_by_user', params={'user_id': user_id})
#     print(response.json())

def get_pantry_items_by_user(user_id):
    response = requests.get(f'{base_url}/get_pantry_items_by_user', params={'user_id': user_id})
    if response.status_code == 200:
        return response.json()
    else:
        print("Failed to fetch pantry items:", response.text)
        return []


def search_user_by_email(email):
    response = requests.get(f'{base_url}/search_user_by_email', params={'email': email})
    print(response.json())

def delete_user_by_email(email):
    response = requests.delete(f'{base_url}/delete_user_by_email', params={'email': email})
    print(response.json())

def search_recipe_by_name(name):
    response = requests.get(f'{base_url}/search_recipe_by_name', params={'name': name})
    print(response.json())

def delete_recipe_by_name(name):
    response = requests.delete(f'{base_url}/delete_recipe_by_name', params={'name': name})
    print(response.json())

def add_user(username, email, password):
    user_data = {'username': username, 'email': email, 'password': password}
    response = requests.post(f'{base_url}/add_user', json=user_data)
    print(response.json())

def add_recipe(name, instructions, pantry_item_id):
    recipe_data = {'name': name, 'instructions': instructions, 'pantry_item_id': pantry_item_id}
    response = requests.post(f'{base_url}/add_recipe', json=recipe_data)
    print(response.json())

def add_pantry_item(name, expiry_date, user_id):
    pantry_item_data = {'name': name, 'expiry_date': expiry_date, 'user_id': user_id}
    response = requests.post(f'{base_url}/add_pantry_item', json=pantry_item_data)
    print(response.json())

def delete_pantry_item(item_id):
    response = requests.delete(f'{base_url}/delete_pantry_item', params={'item_id': item_id})
    print(response.json())

def search_pantry_item_by_name(name):
    response = requests.get(f'{base_url}/search_pantry_item_by_name', params={'name': name})
    print(response.json())


# Example usages
if __name__ == '__main__':
    print("Searching for user by email:")
    search_user_by_email('john@example.com')

    print("Deleting a user by email:")
    delete_user_by_email('jane@example.com')

    print("Searching for recipe by name:")
    search_recipe_by_name('Spaghetti')

    print("Deleting a recipe by name:")
    delete_recipe_by_name('Tomato Soup')

    print("Adding a new user:")
    add_user('alice123', 'alice@example.com', 'secure123')

    print("Adding a new recipe:")
    add_recipe('French Toast', 'Mix eggs and milk, soak bread, and fry on pan.', 1)

    print("Adding a new pantry item:")
    add_pantry_item('Green Beans', '2024-12-01', 1)

    print("Deleting a pantry item by ID:")
    delete_pantry_item(2)

    print("Searching for a pantry item by name:")
    search_pantry_item_by_name('Pasta')
    
    print("Fetching pantry items for user with ID 1:")