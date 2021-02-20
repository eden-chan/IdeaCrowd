import hashlib

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
    todos = db.relationship('TodoItem', cascade="all,delete", back_populates='project')
    elements = db.relationship('ProjectElement', cascade="all,delete", back_populates='project')

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
            'due_date': self.due_date,
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

@app.route('/user/<string:user_id>', methods=['GET'])
def get_user(user_id: str):
    '''
    Send GET request to "domainname.com/user/user_id" where user_id is the
    number of the user id to get infomation on.
    '''
    n = int(hashlib.sha256(user_id.encode('utf-8')).hexdigest(), 16) % 10**8
    user = User.query.filter_by(id = n).first();
    return jsonify(user.toJSON())


@app.route('/user/username/<string:username>', methods=['GET'])
def get_user_by_username(username: str):
    '''
    Send GET request to "domainname.com/user/username/<username>" where <username> is the
    username of the user to get infomation on.
    '''
    user = User.query.filter_by(username=username).first()
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
    if user:
        return error_response(400, 'bad request')
    else:
        def callback(session):
            data = request.get_json()
            n = int(hashlib.sha256(data['id'].encode('utf-8')).hexdigest(), 16) % 10**8
            newUser = User(id=n, username=data['username'], password=data['password'])
            session.add(newUser)
            return jsonify(newUser.toJSON())
        return run_transaction(sessionmaker, callback)
        

@app.route('/login', methods=['POST'])
def validate_user():
    '''
    Send POST request to "domainname.com/login" where the request body contains
    username and password of the user that would like to be authenticated. Will
    return bad request if username password combination is invalid.

    Validation is conducted by checking if the username password pair is in the
    database. NOTE passwords are stored unhashed and unsalted. USE WITH CAUTION
    '''
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user:
        return jsonify(user.toJSON())
    else:
        return error_response(400, 'bad request')


@app.route('/project/<int:project_id>', methods=['GET'])
def get_project(project_id: int):
    '''
    Send GET request to "domainname.com/project/project_id" where project_id is
    the number of the id of the project that would like to be retrieved. Will
    return the project that matches the given project_id or None if there are
    no matches
    '''
    project = Project.query.filter_by(id=project_id).first()
    if project:
        return jsonify(project.toJSON())
    else:
        return error_response(400, 'bad request')

"""
@app.route('/similar/<int:project_id>', methods=['GET'])
def get_similar_projects(project_id: int):
    '''
    Send GET request to "domainname.com/similar/project_id" where project_id
    is the project that would like to be used as the comparision to find other
    similar projects. Will return all projects similar or None if there are no
    matches.
    '''
    pass
"""

@app.route('/user/project/<string:user_id>', methods=['GET'])
def get_user_projects(user_id: str):
    '''
    Send GET request to "domainname.com/user/similar/user_id" where the user_id
    is the user that is the owner(s) of the projects that would like to be searched.
    Will return all projects that have the specified user as the owner or none if
    there are no matches.
    '''
    n = int(hashlib.sha256(user_id.encode('utf-8')).hexdigest(), 16) % 10**8
    project = Project.query.filter(Project.owners.any(id=n));
    if project:
        return jsonify([p.toJSON() for p in project])
    else:
        return error_response(400, 'bad request')


@app.route('/user/project/<string:user_id>/<string:project_name>', methods=['GET'])
def get_project_by_name(user_id:str, project_name:str):
    n = int(hashlib.sha256(user_id.encode('utf-8')).hexdigest(), 16) % 10**8
    project = Project.query.filter(Project.owners.any(id=n)).filter_by(name=project_name).first()
    if project:
        return jsonify(project.toJSON())
    else:
        return error_response(400, 'bad request')

"""
@app.route('/user/similar/<int:user_id>', methods=['GET'])
def get_user_similar_projects():
    '''
    Send GET request to "domainname.com/user/project/user_id" where the user_id
    is the user that would like to be used as the comparision to find other similar
    projects. Matches are found by finding matches for each project that the user
    has. Will return all projects similar or None if there are no matches.
    '''
    pass
"""

@app.route('/create/<string:user_id>', methods=['POST'])
def create_project(user_id: str):
    '''
    Send POST request to "domainname.com/create" where the request body contains
    the data for a new project.
    '''
    n = int(hashlib.sha256(user_id.encode('utf-8')).hexdigest(), 16) % 10**8
    # check if user exists in db because a project must have an owner
    user = User.query.filter_by(id=n).first()
    if user:
        data = request.get_json()
        project = Project.query.filter(Project.owners.any(id=user_id)).filter_by(name=data['name']).first()
        if project:
            return error_response(400, 'project already exists')
        else:
            def callback(session):   
                newProject = Project(name=data['name'])
                newProject.owners.append(user)
                 
        
    
                todoItems = data['todo']
                elementItems = data['element']

                for item in todoItems:
                    newTodo = TodoItem(title=item['title'], description=item['description'], completed=False)
                    newProject.todos.append(newTodo)

                for item in elementItems:
                    newElement = ProjectElement(data=item['data'], type=item['type'])
                    newProject.elements.append(newElement)

                project = session.merge(newProject)
                session.add(project) 
                return jsonify(newProject.toJSON())
            return run_transaction(sessionmaker, callback)
    else:
        return error_response(400, 'user does not exist')


@app.route('/update/<int:project_id>', methods=['POST'])
def update_project(project_id: int):
    '''
    Send POST request to "domainname.com/update/project_id" where project_id is
    the integer representing the id of the project to be updated. The request body
    contains the data for the new version of the project.
    '''
    project = Project.query.filter_by(id=project_id).first()
    if project:
        data = request.get_json()
        if data['todo']:
            for t in project.todos:
                project.todos.remove(t)
            for item in data['todo']:
                newTodo = TodoItem(title=item['title'], description=item['description'], completed=False)
                project.todos.append(newTodo)
        if data['element']:
            for e in project.elements:
                project.elements.remove(e)
            for item in data['element']:
                newElement = ProjectElement(data=item['data'], type=item['type'])
                project.elements.append(newElement)
        db.session.commit()
        return jsonify(project.toJSON())
    else:
        return error_response(400, 'project does not exist')


@app.route('/adduser/<int:project_id>', methods=['POST'])
def add_user_to_project(project_id: int):
    project = Project.query.filter_by(id=project_id).first()
    data = request.get_json()
    user_id = data['id']
    n = int(hashlib.sha256(user_id.encode('utf-8')).hexdigest(), 16) % 10**8
    user = User.query.filter_by(id=n).first()
    if (project and user):
        project.owners.append(user)
        db.session.commit()
        return jsonify(project.toJSON())
    else:
        return error_response(400, 'project does not exist')


if __name__ == '__main__':
    app.run()
