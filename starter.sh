#!/bin/sh

#!/bin/sh

if [ $(ps aux | grep $USER | grep node | grep -v grep | wc -l | tr -s "\n") -eq 0 ]
then
    export NODE_ENV=production
    export PATH=/usr/local/bin:$PATH
    forever start --sourceDir /home/ubuntu/instadviceServer -o /home/ubuntu/instadviceServer/server.log -l /home/ubuntu/instadviceServer/server.log -e /home/ubuntu/instadviceServer/server.log server.js >> /home/ubuntu/instadviceServer/server_log.txt 2>&1
    forever start --sourceDir /home/ubuntu/instadviceServer -o /home/ubuntu/instadviceServer/worker.log -l /home/ubuntu/instadviceServer/server.log -e /home/ubuntu/instadviceServer/server.log worker.js >> /home/ubuntu/instadviceServer/worker_log.txt 2>&1
fi

