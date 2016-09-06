cd /srv/api/server/src/db-utils
node db-apply-scripts
cd /srv/api/server
npm install
grunt apidoc
cd src
pm2 start server.js