from app import create_app
app = create_app()
import routes  # Import routes after app creation to ensure proper initialization

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)
