from types.game import Game
from types.bot import Bot
from types.user import BaseUser
from types.tournaments import Tournament
from types.prediction import Prediction
from types.input import MetaData

users: dict[str, BaseUser] = {}
games: dict[str, Game] = {}
bots: dict[str, Bot] = {}
tournaments: dict[str, Tournament] = {}
predictions: dict[str, Prediction] = {}

metadata: MetaData = MetaData()
