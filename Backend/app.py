from flask import Flask, render_template, request, session, jsonify
from flask_cors import CORS
import logging
import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.environ["OPENAI_API_KEY"]
app_secret_key = os.environ["APP_SECRET_KEY"]

#Set up Flask app
app = Flask(__name__)
CORS(app)
app.secret_key= app_secret_key

#Define the home page route
@app.route("/")
def home():
  session.pop('chat_history', None) # Clear chat history at the start of a new session
  return render_template("index.html")

logging.basicConfig(level=logging.DEBUG)
#Define the Chatbot route
@app.route("/chatbot", methods=["POST"])
def chatbot():
  app.logger.debug("received chatbot request")
  data = request.get_json()
  #Get the message input from the user
  user_input = data["message"]
  
  # Initialize chat history if not already present
  if 'chat_history' not in session:
    session['chat_history'] = []
  
  #use theopenAI API to generate a response 
  # prompt = f"User: {user_input}\nChatbot: "
  
  try:
    response = openai.ChatCompletion.create(
      model="gpt-3.5-turbo",
      messages=[{"role": "user", "content": user_input}]
    )
    
    #Extract the response text form the OpenAI API result
    bot_response = response['choices'][0]['message']['content']
    # bot_response = response.choices[0].text.strip()
  except Exception as e:
    bot_response = f"An error occurred: {str(e)}"
    
  # Append the user input and bot response to the chat history
  session['chat_history'].append({"user": user_input, "bot": bot_response})
  session.modified = True  # Ensure the session is marked as modified
  
  #Render the Chatbot template with the response text
  # return render_template(
  #   "chatbot.html", 
  #   chat_history=session['chat_history'],
  #   user_input=user_input, 
  #   bot_response=bot_response
  #   )
  return jsonify({"bot_response": bot_response})
  
if __name__ == "__main__":
  app.run(host='0.0.0.0', port=5000, debug=True)