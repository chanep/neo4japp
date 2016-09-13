vagrant ssh -c "
    pm2 kill
    cd /srv/api/server
    npm install
    cd /srv/api/server/src/db-utils
    node db-apply-scripts
    cd /srv/api/server
    grunt apidoc
    cd /srv/api/server/src
    pm2 start server.js
"
