from app import app

class ChannelNotFoundException(Exception):
    pass

@app.errorhandler(ChannelNotFoundException)
def channel_not_found(error):
    return 'Channel Not Found', 503