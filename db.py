from peewee import *

database = PostgresqlDatabase('typhoon', **{'user': 'uryoya'})

class UnknownField(object):
    pass

class BaseModel(Model):
    class Meta:
        database = database

class Comments(BaseModel):
    comment = TextField()
    date = DateField()
    number = PrimaryKeyField()
    room_number = IntegerField()
    user = IntegerField(db_column='user_id')

    class Meta:
        db_table = 'comments'

class MenbersInfo(BaseModel):
    number = PrimaryKeyField()
    room_number = IntegerField()
    user_number = IntegerField()

    class Meta:
        db_table = 'menbers_info'

class Rooms(BaseModel):
    id = CharField(unique=True)
    number = PrimaryKeyField()
    password = CharField()

    class Meta:
        db_table = 'rooms'

class Users(BaseModel):
    id = CharField(unique=True)
    name = CharField(unique=True)
    number = PrimaryKeyField()
    password = CharField()

    class Meta:
        db_table = 'users'

