#!/bin/sh

#!/bin/sh

if [ $(ps aux | grep $USER | grep node | grep -v grep | wc -l | tr -s "\n") -eq 0 ]
then
        export NODE_ENV=production
        export PATH=/usr/local/bin:$PATH
        forever start --sourceDir /home/ubuntu/instadviceServer server.js >> /home/ubuntu/instadviceServer/server_log.txt 2>&1
fi

