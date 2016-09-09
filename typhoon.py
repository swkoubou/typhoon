#/usr/bin/env python
"""
Typhoon Chat System Controler
"""
import logging
import tornado.escape
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket
import os.path
import uuid
import datetime
import json
import db
import hashlib
import model
import config

from tornado.options import define, options


define("port", default=config.web_server['port'], help="run on the given port", type=int)

class Application(tornado.web.Application):
    """
    Tornado App Routing
    """
    def __init__(self):
        handlers = [
            (r"/", MainHandler),
            (r"/login", LoginHandler),
            (r"/chatsocket", ChatSocketHandler),
            (r"/auth/login", AuthLoginHandler),
            (r"/auth/signup", AuthSignUpHandler),
            (r"/room/create", RoomCreateHandler),
            (r"/room/invite", RoomInviteHandler),
            (r"/room/enter", RoomEnterHandler),
        ]
        settings = dict(
            cookie_secret="__TDDO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
            login_url="/login",
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            #xsrf_cookies=True,
            debug=True,
        )
        super(Application, self).__init__(handlers, **settings)


class PeeweeRequestHandler(tornado.web.RequestHandler):
    def prepare(self):
        db.database.web.connect()
        return super(PeeweeRequestHandler, self).prepare()

    def on_finish(self):
        if not db.database.is_closed():
            db.database.close()
        return super(PeeweeRequestHandler, self).on_finish()


class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie("user")


class MainHandler(BaseHandler):
    """
    Main Handler
    """
    @tornado.web.authenticated
    def get(self):
        username = self.get_current_user().decode('utf-8')
        self.render("ChatPage.html", username=username)


class LoginHandler(BaseHandler):
    """
    Login Handler
    """
    def get(self):
        self.render("Toppage.html")


class ToppageHandler(BaseHandler):
    def get(self):
        self.render("Toppage.html")


class ChatSocketHandler(tornado.websocket.WebSocketHandler):
    waiters = set()

    def get_compression_options(self):
        return {}

    def open(self):
        ChatSocketHandler.waiters.add(self)

    def on_close(self):
        ChatSocketHandler.waiters.remove(self)

    @classmethod
    def send_updates(cls, chat):
        logging.info("sending message to %d waiters", len(cls.waiters))
        for waiter in cls.waiters:
            try:
                waiter.write_message(chat)
            except:
                logging.error("Error sending message", exc_info=True)

    def on_message(self, comment):
        logging.info("got comment %r", comment)
        parsed = tornado.escape.json_decode(comment)

        date = datetime.datetime.now()
        comment = {
            "comment": parsed['comment'],
            "date": str(date),
            "username": parsed['username'],
            "room_id": parsed['room_id'],
        }
        ChatSocketHandler.send_updates(comment)
        model.CommentCache.add(
            comment['comment'],
            date,
            db.Users.get(db.Users.name == comment['username']).number,
            db.Rooms.get(db.Rooms.id == comment['room_id']).number,
        )


# API endpoints
class AuthLoginHandler(BaseHandler):
    """
    Authorization API
    endpoint: /auth/login
    """
    def post(self):
        """
        POST method:
        @username   user's name
        @password   user's password
        """
        # get arguments from post method
        data = tornado.escape.json_decode(self.request.body)
        username = data["username"]
        password = hashlib.sha1(
            bytes(  # unicode object must be encode before hashing
                data["password"],
                "utf-8"
            )
        ).hexdigest()

        # login check
        try:
            user = db.Users.get(db.Users.name == username)
            if password == user.password:   # successs login!
                self.write(json.dumps({'is_success': 'true'}))
                self.set_secure_cookie("user", username)
                return
            else:
                self.write(json.dumps({'is_success': 'false'}))
                return
        except:
            self.write(json.dumps({'is_success': 'false'}))


class AuthSignUpHandler(BaseHandler):
    """
    Authorization API
    endpoint: /auth/signup
    """
    def post(self):
        """
        POST method:
        @username   user's new name
        @password   user's new password
        """
        # get arguments from post method
        data = tornado.escape.json_decode(self.request.body)
        username = data["username"]
        password = hashlib.sha1(
            bytes(  # unicode object must be encode before hashing
                data["password"],
                "utf-8"
            )
        ).hexdigest()


        # check whethre this username is already exists
        # and when database don't have this username, to save user
        try:
            db.Users.select().where(db.Users.name == username).get() # TODO: cange like AuthLoginHandler 
        except: 
            # save username and password in database
            db.Users.create(
                id=uuid.uuid4(), 
                name=username,
                password=password,
            )
            self.write(json.dumps({'is_success': 'true'}))
            self.set_secure_cookie("user", username)
        else:
            self.write(json.dumps({'is_success': 'false', 'reason': 'exsit'}))


class RoomCreateHandler(BaseHandler):
    """
    endpoint: /room/create
    """
    def post(self):
        # get arguments from post method
        data = tornado.escape.json_decode(self.request.body)
        username = data["username"]
        room_id = data["room_id"]
        password = hashlib.sha1(
            bytes(  # unicode object must be encode before hashing
                data["password"],
                "utf-8"
            )
        ).hexdigest()

        # check whethre this room_id is already exists
        # and when database don't have this room_id, to save user
        try:
            db.Rooms.get(db.Rooms.id == room_id)
        except: 
            # save room_id and password in database
            db.Rooms.create(
                id=room_id,
                password=password,
            )
            room = db.Rooms.get(db.Rooms.id == room_id)
            db.MenbersInfo.create(
                user_number=db.Users.get(db.Users.name == username).number,
                room_number=room.number,
            )
            self.write(json.dumps({'is_success': 'true'}))
        else:
            self.write(json.dumps({'is_success': 'false', 'reason': 'exsit'}))


class RoomInviteHandler(BaseHandler):
    """
    endpoint: /room/inite
    """
    def post(self):
        pass


class RoomEnterHandler(BaseHandler):
    """
    endpoint: /room/enter
    """
    def post(self):
        # get arguments from post method
        data = tornado.escape.json_decode(self.request.body)
        username = data["username"]
        room_id = data["room_id"]
        password = hashlib.sha1(
            bytes(  # unicode object must be encode before hashing
                data["password"],
                "utf-8"
            )
        ).hexdigest()

        # login check
        try:
            room = db.Rooms.get(db.Rooms.id == room_id)
            if password == room.password:   # successs login!
                db.MenbersInfo.create(
                    user_number=db.Users.get(db.Users.name == username).number,
                    room_number=room.number,
                )
                self.write(json.dumps({'is_success': 'true'}))
                return
            else:
                self.write(json.dumps({'is_success': 'false'}))
                return
        except:
            self.write(json.dumps({'is_success': 'false'}))


def main():
    tornado.options.parse_command_line()
    app = Application()
    app.listen(options.port)
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    main()

