# Activate the virtual environment
. .\venv\Scripts\Activate.ps1


# GOAL
it's like whatsapp but to see images from the cameras from robots and control them. so after creating an account an loging in a user should be able to add a robot to his list of robots. when adding a robot, the user should get the credentials (code) for the robot. when selecting a robot the user should be able to see the controller page for that robot (a page with a video feeld to see the camera of the robot) and some control inputs. on the robot the same web app is running, but instead of loging as a user, their should be the option to login as a robot. here the user has to give the credentials (code) of the robot. no login as robot should be after loging in as user and after selecting the robot

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