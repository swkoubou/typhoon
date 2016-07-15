#/usr/bin/env python
"""
Typhoon Chat System Controler
"""
import uuid
import datetime

from peewee import (PostgresqlDatabase, Model, IntegerField,
                    CharField, TextField, DateField)


db = PostgresqlDatabase('typhoon', user='uryoya')   # create db handler


class BaseModel(Model):
    """
    database template
    """
    class Meta:
        database = db


class Chat(BaseModel):
    chat_id = CharField(primary_key=True)
    body = CharField()

    @staticmethod
    def add(body):
        chat_id_cache = str(uuid.uuid4())
        Chat.create(
            chat_id = chat_id_cache,
            body = body
        )
        
        return chat_id_cache

    @staticmethod
    def genall():
        for chat in Chat.select():
            yield {'chat_id': chat.chat_id, 'body': chat.body}

    @staticmethod
    def delete():
        pass


class Comment(BaseModel):
    number = IntegerField(primary_key=True, null=False)
    comment = TextField(null=False)
    date = DateField(null=False)
    id = IntegerField(null=False)
    room_id = IntegerField(null=False)

    @classmethod
    def add(cls, comment, id, room_id):
        cls.create(
            comment = comment,
            date = datetime.datetime.now(),
            id = id,
            room_id = room_id
        )

    @classmethod
    def delete(cls):
        pass

