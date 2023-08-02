# Activate the virtual environment
. .\venv\Scripts\Activate.ps1

# Install requirements
(pip freeze > requirements.txt)
pip install -r requirements.txt
git add .
git commit -m 'Add new feature X'
git push

# setting up app:
npm install express socket.io
node signaling_server.js

# heroku 
heroku login
git push heroku master
git push heroku start_stop:master
heroku open

# visiting heroku website: https://your-app-name.herokuapp.com/robot.html