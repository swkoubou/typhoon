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

from tornado.options import define, options


class Application(tornado.web.Application):
    """
    Tornado App Routing
    """
    def __init__(self):
        handlers = [
            (r"/", MainHandler),
            (r"/login", LoginHandler),
            (r"/chatsocket", ChatSocketHandler),
        ]
        settings = dict(
            cookie_secret="__TDDO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
            login_url="/login",
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            xsrf_cookies=True,
            debug=True;
        )
        super(Application, self).__init__(handlers, **settings)


class PeeweeRequestHandler(tornado.web.RequestHandler):
    def prepare(self):
        db.connect()
        return super(PeeweeRequestHandler, self).prepare()

    def on_finish(self):
        if not db.is_closed():
            db.close()
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
        cache = []
        for chat in Chat.genall():
            chat["html"] = tornado.escape.to_basestring(
                self.render_string("message.html", message=chat)
            )
            cache.append(chat)
        self.render("index.html", messages=cache)


class LoginHandler(BaseHandler):
    """
    Login Page Handler
    """
    def post(self):
        pass


class ChatSocketHandler(tornado.websocket.WebSocketHandler):
    waiters = set()
    cache = []
    cache_size = 200

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

    def on_message(self, message):
        logging.info("got message %r", message)
        parsed = tornado.escape.json_decode(message)

        chat = {
            "chat_id": Chat.add(parsed["body"]),   # Chat.add() return uuid
            "body": parsed["body"]
        }
        chat["html"] = tornado.escape.to_basestring(
            self.render_string("message.html", message=chat)
        )
        ChatSocketHandler.send_updates(chat)



def main():
    tornado.options.parse_command_line()
    app = Application()
    app.listen(options.port)
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    main()

