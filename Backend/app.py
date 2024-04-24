from flask import Flask, render_template, request, session, jsonify
from flask_cors import CORS
import logging
import openai
import os
from dotenv import load_dotenv
# Import db instance and models from models.py
from models import db, User, PantryItem, Recipe, Favorite  # Import other models as needed
from routes import backend

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pantryai.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.secret_key = os.environ["APP_SECRET_KEY"]
    openai.api_key = os.environ["OPENAI_API_KEY"]
    app.register_blueprint(backend)

    db.init_app(app)

    CORS(app)
    logging.basicConfig(level=logging.DEBUG)


    @app.route("/")
    def home():
        # Clears the chat history at the start of a new session.
        session.pop('chat_history', None)
        # Render the home page template.
        return render_template("index.html")


    @app.route("/chatbot", methods=["POST"])
    def chatbot():
        # Logs the receipt of a chatbot request.
        app.logger.debug("Received chatbot request")
        # Gets the JSON data sent with the POST request.
        data = request.get_json()
        # Retrieves the message from the user from the JSON data.
        user_input = data["message"]

        # Initializes chat history if it doesn't exist in the session.
        if 'chat_history' not in session:
            session['chat_history'] = []

        try:
            # Calls OpenAI's Chat Completion and generates a response.
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": user_input}]
            )
            # Extracts the bot response from the OpenAI API result.
            bot_response = response['choices'][0]['message']['content']
        except Exception as e:
            # Handles any errors that occur during the OpenAI API call.
            bot_response = f"An error occurred: {str(e)}"

        # Appends the user input and bot response to the chat history in the session.
        session['chat_history'].append({"user": user_input, "bot": bot_response})
        session.modified = True  # Marks the session as modified to ensure it's saved.
        # Returns the bot response in JSON format.
        return jsonify({"bot_response": bot_response})

    return app