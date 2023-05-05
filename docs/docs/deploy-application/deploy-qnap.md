---
sidebar_position: 5
---

# Deploy on a QNAP NAS

The application can be deployed on QNAP NAS running QTS using the Docker image available at `bocabitlabs/buho-stocks:latest`

## Requirements
- Container Station: provides interface to deploy Docker and Linux containers
- MariaDB: MySQL database server
- phpMyAdmin: application to manage MySQL database via a web interface, that will be used to interact with MariaDB


All the above required applications are available in the AppCenter.


## 1. Configure MariaDB

Install MariaDB 10 from the AppCenter. Once the installation is complete, go to Control Panel > Applications.
Activate the service by clicking on the toggle button and enable TCP/IP networking as shown in the image below. Define root password and apply the changes before closing the window.


![MariaDB - service running](/img/qnap-installation/mariadb_config_1.png)



## 2. Configure phpMyAdmin

Access Control Panel and enable Web Server.

![Web Server - enabled via Control Panel](/img/qnap-installation/web_server_1.png)

Install phpMyAdmin from the AppCenter.

Add the following lines to `/Web/phpMyAdmin/config.inc.php` (before the end of file marker `?>`) to allow phpMyAdmin connection with MariaDB.

Depending on file system configuration and user account permissions, the file might only be editable using `admin` account.

```
port: $cfg['Servers'][$i]['port'] = '3307';
socket: $cfg['Servers'][$i]['socket'] = '/var/run/mariadb10.sock';
```


## 3. Create database table and user

Login into phpMyAdmin using MariaDB´s root account configured in step 1 and create a user and a table to be used by the application.

In the image below, the table name is `buho-stocks-database` and the user is `buho-stocks-user`.

![phpMyAdmin - creating DB table](/img/qnap-installation/phpmyadmin_config_1.png)


![phpMyAdmin - creating user and setting privileges](/img/qnap-installation/phpmyadmin_config_2.png)


## 4. Populate application configuration files

Create a `config` directory to store the configuration files as specified [here](./deploy-docker/).

Both `config.py` and `mysql.conf` must be placed inside the `config` directory.

`config.py` does not require any changes.

`mysql.conf` must be populated with the database name and access credentials (user and password) defined in steps 1 and 3.

```
[client]
database = buho-stocks-database
user = buho-stocks-user
password = [user password as defined via phpMyAdmin in step 3]
default-character-set = utf8
host = 127.0.0.1
port = 3307
```

The figure shows directories to be mounted in the container for persistent data storage.

![Application directories](/img/qnap-installation/directories_1.png)


## 5. Run the application

Open Container Station and locate `buho-stock` container image. Click install and keep `latest` as image tag (default value).

![buho-stock container image in Container Station](/img/qnap-installation/container_config_1.png)


In the "Create Container" window, click on "Advanced Settings".


![buho-stock container image in Container Station](/img/qnap-installation/container_config_2.png)


In the Network section, set Network Mode to `host`.

![buho-stock container image in Container Station](/img/qnap-installation/container_config_3.png)


In the Shared Folders section, mount the `config` and `media` folders in the correct mount points.

![buho-stock container image in Container Station](/img/qnap-installation/container_config_4.png)


Click on Create and confirm all the settings in the Summary window.

![buho-stock container image in Container Station](/img/qnap-installation/container_config_5.png)



## 6. Create super user

:::info

This step is deprecated and is not needed anymore since version `0.100.0`.

:::

SSH into QNAP NAS and start an interactive bash session into `buho-stocks` container.

```
[User@qnap ~]$ docker exec -it buho-stocks-1 bash
root@qnapy:/usr/src/app#
```

Execute `manage.py` to create super user as described [here](./create-initial-admin-user).

The application is now deployed and available on port 34800.