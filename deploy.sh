tar -zcf filetransferapp.tgz -C build/ .;
scp filetransferapp.tgz oregon:~/;
ssh oregon \
    "sudo rm -rf /var/www/file-transfer/*; \
    sudo tar -zxf filetransferapp.tgz -C /var/www/file-transfer/; \
    sudo chown -R nginx /var/www/file-transfer/; \
    sudo chgrp -R nginx /var/www/file-transfer/;"