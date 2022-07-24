"""utility internal exceptions"""


class TreeAlreadyLikedException(BaseException):
    """exception that occurs trying to like post that you have already liked"""


class TreeIsNotLikedException(BaseException):
    """exception that occurs trying to unlike post that you have not liked"""


class UsernameBusyException(BaseException):
    """exception occurs when user with given username already exists"""


class ObjectDoesNotExistException(BaseException):
    """exception occurs trying to perform action on an object that does not exist"""


class UserDoesNotHaveAccessException(BaseException):
    """exception occurs when user does not have permission to do action"""
