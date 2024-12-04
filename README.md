### Comment utiliser ce projet ?
#### 1. Initialisation :
- Installer redis sur votre machine
- Aller dans le dossier "youtube-archi-exec" et y creer un environnement conda avec les packages
    google-api-python-client
    google-auth-httplib2
    google-auth-oauthlib
    flask
    transformers
    Flask-SocketIO
    redis
    google-api-python-client-stubs
- Aller dans le dossier "youtube-archi-frontend" et faire "npm install"
- Configurer les secrets pour l'API YouTube :
    - Creer un fichier client_secret.json d'un compte google ayant accès à un projet sur l'API YouTube Data v3 via la console google et le stocker dans "youtube-archi-exec/credentials/".

#### 2. Lancement
- Lancer le client redis sur le port 6739 via la commande redis-cli
- Lancer le backend dans le dossier "youtube-archi-exec" via la commande flask --app app --debug run
- Lancer le frontend dans le dossier "youtube-archi-frontend" via la commande npm run dev