vagrant ssh -c "
    cd /srv/api/server/src/
    node ./utils/force-task-stop
    node task-scheduler import-all
"
