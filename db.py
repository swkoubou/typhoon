from peewee import *

database = PostgresqlDatabase('typhoon', **{'user': 'uryoya'})

class UnknownField(object):
    pass

class BaseModel(Model):
    class Meta:
        database = database

class Chat(BaseModel):
    body = CharField(null=True)
    chat = TextField(db_column='chat_id', primary_key=True)

    class Meta:
        db_table = 'chat'

class Comments(BaseModel):
    comment = TextField()
    comment_number = PrimaryKeyField()
    date = DateField()
    id_number = IntegerField()
    room_number = IntegerField()

    class Meta:
        db_table = 'comments'

class MenberInfo(BaseModel):
    id_number = IntegerField()
    menber_number = PrimaryKeyField()
    room_number = IntegerField()

    class Meta:
        db_table = 'menber_info'

class Rooms(BaseModel):
    password = CharField()
    room = CharField(db_column='room_id', unique=True)
    room_number = PrimaryKeyField()

    class Meta:
        db_table = 'rooms'

class Users(BaseModel):
    id_name = CharField(unique=True)
    id_number = PrimaryKeyField()
    password = CharField()
    user_name = CharField(unique=True)

    class Meta:
        db_table = 'users'

