from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy.orm
from cockroachdb.sqlalchemy import run_transaction


CONFIG_PATH = './rest.cfg'

### App Setup
app = Flask(__name__)
app.config.from_pyfile(CONFIG_PATH)
db = SQLAlchemy(app)
sessionmaker = sqlalchemy.orm.sessionmaker(db.engine)

### Database Schemas
class User(db.Model):
    pass


class Project(db.Model):
    pass


### URL Routes
#   Note that domainname.com in the below comments means the actual domain name
#   that the live app is run i.e running locally would be localhost and on a vps
#   would be the url that the vps provides.

@app.route('/user/<int:user_id>', methods=['GET'])
def get_user():
    '''
    Send GET request to "domainname.com/user/user_id" where user_id is the
    number of the user id to get infomation on.
    '''
    pass



@app.route('/signup', methods=['POST'])
def create_user():
    '''
    Send POST request to "domainname.com/signup" where the request body contains
    username and password that would like to be created. Will return bad request
    if username already exists in database.
    '''
    pass


@app.route('/login', methods=['POST'])
def validate_user():
    '''
    Send POST request to "domainname.com/login" where the request body contains
    username and password of the user that would like to be authenticated. Will
    return bad request if username password combination is invalid.

    Validation is conducted by checking if the username password pair is in the
    database. NOTE passwords are stored unhashed and unsalted. USE WITH CAUTION
    '''
    pass


@app.route('/project/<int:project_id>', methods=['GET'])
def get_project():
    '''
    Send GET request to "domainname.com/project/project_id" where project_id is
    the number of the id of the project that would like to be retrieved. Will
    return the project that matches the given project_id or None if there are
    no matches
    '''
    pass


@app.route('/similar/<int:project_id>', methods=['GET'])
def get_similar_projects():
    '''
    Send GET request to "domainname.com/similar/project_id" where project_id
    is the project that would like to be used as the comparision to find other
    similar projects. Will return all projects similar or None if there are no
    matches.
    '''
    pass


@app.route('/user/project/<int:user_id>', method=['GET'])
def get_user_projects():
    '''
    Send GET request to "domainname.com/user/similar/user_id" where the user_id
    is the user that is the owner(s) of the projects that would like to be searched.
    Will return all projects that have the specified user as the owner or none if
    there are no matches.
    '''
    pass


@app.route('/user/similar/<int:user_id>', methods=['GET'])
def get_user_similar_projects():
    '''
    Send GET request to "domainname.com/user/project/user_id" where the user_id
    is the user that would like to be used as the comparision to find other similar
    projects. Matches are found by finding matches for each project that the user
    has. Will return all projects similar or None if there are no matches.
    '''
    pass


@app.route('/create', methods=['POST'])
def create_project():
    '''
    Send POST request to "domainname.com/create" where the request body contains
    the data for a new project.
    '''
    pass


@app.route('/update/<int:project_id>', methods=['POST'])
def update_project():
    '''
    Send POST request to "domainname.com/update/project_id" where project_id is
    the integer representing the id of the project to be updated. The request body
    contains the data for the new version of the project.
    '''
    pass


if __name__ == '__main__':
    app.run()
