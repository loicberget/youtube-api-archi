import datetime
import re

def days_since_iso_date(iso_date):
    date = datetime.datetime.fromisoformat(iso_date)
    if date.tzinfo is None:
        date = date.replace(tzinfo=datetime.timezone.utc)
    now = datetime.datetime.now(datetime.timezone.utc)
    delta = now - date
    return delta.days


def iso8601_duration_as_seconds(duration):
    hours = re.search(r"(\d+)H", duration)
    hours = hours.group(1) if hours else 0
    minutes = re.search(r"(\d+)M", duration)
    minutes = minutes.group(1) if minutes else 0
    seconds = re.search(r"(\d+)S", duration)
    seconds = seconds.group(1) if seconds else 0

    return int(hours) * 3600 + int(minutes) * 60 + int(seconds)
