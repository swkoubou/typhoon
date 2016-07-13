from peewee import *

database = PostgresqlDatabase('mydb', **{'user': 'uryoya'})

class UnknownField(object):
    pass

class BaseModel(Model):
    class Meta:
        database = database

class Cities(BaseModel):
    hoge = IntegerField(null=True)
    name = CharField(primary_key=True)

    class Meta:
        db_table = 'cities'

class Hoge(BaseModel):
    a = CharField()
    b = CharField()

    class Meta:
        db_table = 'hoge'

class Weather(BaseModel):
    city = CharField(null=True)
    date = DateField(null=True)
    prcp = FloatField(null=True)
    temp_hi = IntegerField(null=True)
    temp_lo = IntegerField(null=True)

    class Meta:
        db_table = 'weather'

