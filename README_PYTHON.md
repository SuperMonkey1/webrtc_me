# Activate the virtual environment
. .\venv\Scripts\Activate.ps1

# Install requirements
(pip freeze > requirements.txt)
pip install -r requirements.txt
git add .
git commit -m 'Add new feature X'
git push
