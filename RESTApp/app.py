from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy.orm
from cockroachdb.sqlalchemy import run_transaction

CONFIG_PATH = './rest.cfg'

app = Flask(__name__)
app.config.from_pyfile(CONFIG_PATH)
db = SQLAlchemy(app)
sessionmaker = sqlalchemy.orm.sessionmaker(db.engine)

if __name__ == '__main__':
    app.run()
