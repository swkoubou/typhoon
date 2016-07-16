#!/usr/bin/env python
"""
typhoon chat system model
"""
import db


class CommentCache:
    SAVE_GAIN_SIZE = 10
    cache = []

    @classmethod
    def save_to_db(cls):
        db.database.connect()
        end = cls.cache[cls.SAVE_GAIN_SIZE]
        while cls.cache[0] is not end:
            db.Comments.create(**cls.cache[0])
            del cls.cache[0]
        db.database.close()

    @classmethod
    def add(cls, comment, date, id, room_number):
        cls.cache.append({
            "comment": comment,
            "date": date,
            "user": id,
            "room_number": room_number,
        });

        if len(cls.cache) > cls.SAVE_GAIN_SIZE:
            cls.save_to_db()

    @classmethod
    def getsize(cls):
        return cls.SAVE_GAIN_SIZE
