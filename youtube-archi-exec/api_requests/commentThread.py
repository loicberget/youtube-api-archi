from __future__ import annotations
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from googleapiclient._apis.youtube.v3 import YouTubeResource  # type: ignore
import googleapiclient


def get_comments_by_video(video_id, youtube : YouTubeResource):
    comments = []
    next_page_token = None

    while True:
        try:
            request = youtube.commentThreads().list(
                part="snippet",
                videoId=video_id,
                maxResults=100,
                pageToken=next_page_token,
            )
            response = request.execute()
            
            for item in response["items"]:
                comment = {
                    "author": item["snippet"]["topLevelComment"]["snippet"][
                        "authorDisplayName"
                    ],
                    "text": item["snippet"]["topLevelComment"]["snippet"][
                        "textDisplay"
                    ],
                    "publishedAt": item["snippet"]["topLevelComment"]["snippet"][
                        "publishedAt"
                    ],
                }
                comments.append(comment)

            next_page_token = response.get("nextPageToken")
            if not next_page_token:
                break
        except googleapiclient.errors.HttpError as e:
            if e.resp.status == 403 and "commentsDisabled" in str(e):
                print(f"Comments are disabled for video ID: {video_id}")
                break
            else:
                raise e

    return comments
