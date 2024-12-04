from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from googleapiclient._apis.youtube.v3 import YouTubeResource  # type: ignore

import googleapiclient

from exceptions import ChannelNotFoundException


def get_channels_videos_ids(channel_id, youtube: YouTubeResource):
    request = youtube.channels().list(part="contentDetails", id=channel_id)
    try:
        response = request.execute()
    except googleapiclient.errors.HttpError as e:
        print(e)
        return

    uploads_playlist_id = response["items"][0]["contentDetails"]["relatedPlaylists"][
        "uploads"
    ]

    video_ids = []
    next_page_token = None

    while True:
        request = youtube.playlistItems().list(
            part="snippet",
            playlistId=uploads_playlist_id,
            maxResults=50,
            pageToken=next_page_token,
        )
        try:
            response = request.execute()
        except googleapiclient.errors.HttpError as e:
            print(e)
            return

        for item in response["items"]:
            video_ids.append(item["snippet"]["resourceId"]["videoId"])

        next_page_token = response.get("nextPageToken")
        if not next_page_token:
            break

    return video_ids


def get_channel_id_by_name(channel_name, youtube: YouTubeResource):
    request = youtube.search().list(
        part="snippet", q=channel_name, maxResults=1, type="channel"
    )
    try:
        response = request.execute()
    except googleapiclient.errors.HttpError as e:
        print(e)
        return

    if (
        not response["items"]
        or response["items"][0]["snippet"]["title"].lower() != channel_name.lower()
    ):
        raise ChannelNotFoundException(f"Channel {channel_name} not found")
    return response["items"][0]["id"]["channelId"]
