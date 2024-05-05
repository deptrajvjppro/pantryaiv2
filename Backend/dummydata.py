from app import create_app, db
from models import User, PantryItem, ShoppingNote
from datetime import datetime

def create_tables():
    app = create_app()
    with app.app_context():
        print("Creating tables...")
        db.create_all()
        print("Tables created.")


def populate_dummy_data():
    app = create_app()
    with app.app_context():
        user1 = User.query.filter_by(email='john@example.com').first()
        if not user1:
            user1 = User(username='john_doe', password='password123', email='john@example.com')
            db.session.add(user1)
            db.session.commit()  # Ensure user1 is committed to obtain an ID

        user2 = User.query.filter_by(email='jane@example.com').first()
        if not user2:
            user2 = User(username='jane_doe', password='password123', email='jane@example.com')
            db.session.add(user2)
            db.session.commit()  # Ensure user2 is committed to obtain an ID

        # Assuming users exist or are created, create pantry items
        item1 = PantryItem(name='Pasta', expiry_date=datetime(2024, 5, 17), quantity=5, user_id=user1.id)
        item2 = PantryItem(name='Tomato Sauce', expiry_date=datetime(2020, 11, 17), quantity=3, user_id=user2.id)
        db.session.add(item1)
        db.session.add(item2)

        db.session.commit()

if __name__ == '__main__':
    create_tables()

    populate_dummy_data()
