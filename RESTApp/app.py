from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy.orm
from werkzeug.http import HTTP_STATUS_CODES
from cockroachdb.sqlalchemy import run_transaction


CONFIG_PATH = './rest.cfg'

### App Setup
app = Flask(__name__)
app.config.from_pyfile(CONFIG_PATH)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
sessionmaker = sqlalchemy.orm.sessionmaker(db.engine)

### Database Schemas

# lookup table to help model the many-to-many relationship between Users and Projects
ownership = db.Table('ownership',
    db.Column('project_id', db.Integer, db.ForeignKey('projects.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
)

class User(db.Model):
    '''
    Represents an application user. NOTE again... passwords are
    stored naked in the database! No hashing or salting is done!
    A User can own none, one, or many projects
    '''
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(256), index=True, unique=True)
    password = db.Column(db.String(256), index=True)
    projects = db.relationship('Project', secondary=ownership, back_populates='owners')

    def __repr__(self) -> str:
        '''
        Return a string representation of the User object. 
        Easier debugging.
        '''
        return f'<User {self.username}>'

    def toJSON(self) -> dict:
        '''
        Returns a JSON serializable object representation of the User
        '''
        toDict = {
            'id': self.id,
            'username': self.username,
            'projects': [p.id for p in self.projects]
        }
        return toDict


class Project(db.Model):
    '''
    Represents a project that can be created by users.
    A Project can have one or many owners that are of type User.
    '''
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), index=True)
    owners = db.relationship('User', secondary=ownership, back_populates='projects')
    todos = db.relationship('TodoItem', back_populates='project')
    elements = db.relationship('ProjectElement', back_populates='project')

    def __repr__(self) -> str:
        '''
        Return a string representation of the Project object. 
        Easier debugging.
        '''
        return f'<Project {self.name}>'

    def toJSON(self) -> dict:
        '''
        Returns a JSON serializable object representation of the Project
        '''
        toDict = {
            'id': self.id,
            'name': self.name,
            'owners': [u.id for u in self.owners],
            'todos': [t.toJSON() for t in self.todos],
            'elements': [e.toJSON() for e in self.elements]
        }
        return toDict


class TodoItem(db.Model):
    '''
    Represents an editable todo elemement in a project.
    '''
    __tablename__ = 'todoitems'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(256))
    description = db.Column(db.String(600))
    completed = db.Column(db.Boolean)
    due_date = db.Column(db.DateTime)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    project = db.relationship('Project', back_populates='todos')

    def __repr__(self) -> str:
        '''
        Return a string representation of the TodoItem object. 
        Easier debugging.
        '''
        return f'<TodoItem {self.description}>'

    def toJSON(self) -> dict:
        '''
        Returns a JSON serializable object representation of the TodoItem
        '''
        toDict = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'completed': self.completed,
            'due_date': self.due_date.isoformat(),
            'project_id': self.project_id
        }
        return toDict


class ProjectElement(db.Model):
    '''
    Represents an editable element in a project. The data is stored as a string
    regardless of what the original type it was (text, image, audio etc) as string
    is the common "intermediate" type between all these formats. This also stores
    a field that captures the original type thus on retreiving, the string can be
    decoded to the original type.
    '''
    __tablename__ = 'projectelements'

    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.String())
    type = db.Column(db.String(256), index=True)
    position = db.Column(db.Integer)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    project = db.relationship('Project', back_populates='elements')

    def __repr__(self) -> str:
        '''
        Return a string representation of the ProjectElement object. 
        Easier debugging.
        '''
        return f'<ProjectElement {self.data}>'

    def toJSON(self) -> dict:
        '''
        Returns a JSON serializable object representation of the ProjectElement
        '''
        toDict = {
            'id': self.id,
            'data': self.data,
            'type': self.type,
            'position': self.position,
            'project_id': self.project_id
        }
        return toDict

### Error responses


def error_response(status_code, message=None):
    payload = {'error': HTTP_STATUS_CODES.get(status_code, 'Unknown error')}
    if message:
        payload['message'] = message
    response = jsonify(payload)
    response.status_code = status_code
    return response


### URL Routes
#   Note that domainname.com in the below comments means the actual domain name
#   that the live app is run i.e running locally would be localhost and on a vps
#   would be the url that the vps provides.

@app.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id: int):
    '''
    Send GET request to "domainname.com/user/user_id" where user_id is the
    number of the user id to get infomation on.
    '''
    user = User.query.filter_by(id = user_id)[0];
    return jsonify(user.toJSON())


@app.route('/signup', methods=['POST'])
def create_user():
    '''
    Send POST request to "domainname.com/signup" where the request body contains
    username and password that would like to be created. Will return bad request
    if username already exists in database.
    '''
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    print(user)
    if user:
        return error_response(400, 'bad request')
    else:
        def callback(session):
            data = request.get_json()
            newUser = User(username=data['username'], password=data['password'])
            session.add(newUser)
            return jsonify(newUser.toJSON())
        return run_transaction(sessionmaker, callback)
        

"""
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
"""

if __name__ == '__main__':
    app.run()
