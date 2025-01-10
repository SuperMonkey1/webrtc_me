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

# visiting heroku website: https://roboroo-69b18e1c5d49.herokuapp.com





# deploy: 
heroku login
git push heroku master
(git push heroku start_stop:master)
heroku open

# Use
controller: go to https://roboroo-69b18e1c5d49.herokuapp.com/controller.html
robot: go to https://roboroo-69b18e1c5d49.herokuapp.com/robot.html

# More Info
go to blowholds chrome and Kermit in Projects folder