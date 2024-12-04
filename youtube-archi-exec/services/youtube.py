from __future__ import annotations
import googleapiclient.discovery as discovery
import google_auth_oauthlib
import os
import google
import json
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from googleapiclient._apis.youtube.v3 import YouTubeResource  # type: ignore

SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"]
CLIENT_SECRET_FILE = "credentials/client_secret.json"
TOKEN_FILE = "credentials/token.json"


def get_service() -> YouTubeResource:
    creds = None
    # Load existing credentials from token file
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, "r") as token:
            creds = google.oauth2.credentials.Credentials.from_authorized_user_info(
                json.load(token), SCOPES
            )

    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(google.auth.transport.requests.Request())
            except google.auth.exceptions.RefreshError:
                # Token has been expired or revoked, remove the token file and prompt login
                os.remove(TOKEN_FILE)
                return redirect_to_login()
        else:
            return redirect_to_login()

    try:
        service = discovery.build("youtube", "v3", credentials=creds)
        return service
    except google.HttpError as e:
        print(f"An error occurred: {e}")
        return None

def redirect_to_login():
    flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
        CLIENT_SECRET_FILE, SCOPES
    )
    creds = flow.run_local_server(port=0)
    # Save the credentials for the next run
    with open(TOKEN_FILE, "w") as token:
        token.write(creds.to_json())
    return discovery.build("youtube", "v3", credentials=creds)