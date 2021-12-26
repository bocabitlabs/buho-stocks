# Path of the database
# Default: "/usr/src/data/db.sqlite3"
DATABASE_PATH = "/usr/src/data/db.sqlite3"
# Secret key for the application. Can be generated by os.urandom(20).
# It is generated automatically when the container is created for the first time
SECRET_KEY = 'REPLACE_SECRET_KEY'
# List of allowed hosts to access the application
# Default: ['0.0.0.0', 'localhost']
ALLOWED_HOSTS = ['0.0.0.0', 'localhost']

# Path to the media files uploaded by the users
# Default: "/usr/src/media/"
MEDIA_ROOT = "/usr/src/media/"
