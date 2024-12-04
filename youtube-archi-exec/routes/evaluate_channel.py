from __future__ import annotations
import json
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from googleapiclient._apis.youtube.v3 import YouTubeResource  # type: ignore

from flask import jsonify
from services.youtube import get_service as get_youtube_service
from api_requests.commentThread import get_comments_by_video
from api_requests.channels import get_channels_videos_ids, get_channel_id_by_name
from app import app, redis_client, socketio
from machine_learning.sentiment_analysis import get_pipeline

CACHE_EXPIRATION = 24 * 60 * 60


@app.route("/evaluate_channel/<channel_name>", methods=["GET"])
def evaluate_channel(channel_name):
    cached_comments = redis_client.get(f"comments:{channel_name}")
    if cached_comments:
        return cached_comments
    else:
        youtube: YouTubeResource = get_youtube_service()
        channel_id = get_channel_id_by_name(channel_name, youtube)

        video_ids = get_channels_videos_ids(channel_id, youtube)

        all_comments = []

        total_videos = len(video_ids)
        for i, video_id in enumerate(video_ids):
            comments = get_comments_by_video(video_id, youtube)
            all_comments.extend(comments)
            progress = (i + 1) / total_videos * 100
            socketio.emit(
                "progress", {"step": "fetching_comments", "data": f"{progress:.2f}%"}
            )
        
        sentiment_pipeline = get_pipeline()

        total_comments = len(all_comments)
        for i, comment in enumerate(all_comments):
            comment["sentiment"] = sentiment_pipeline(comment["text"])[0]
            comment["id"] = i
            progress = (i + 1) / total_comments * 100
            socketio.emit(
                "progress", {"step": "analyzing_sentiment", "data": f"{progress:.2f}%"}
            )

        redis_client.set(
            f"comments:{channel_name}", json.dumps(all_comments), ex=CACHE_EXPIRATION
        )

        return jsonify(all_comments)
