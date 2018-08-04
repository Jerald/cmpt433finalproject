# cmpt433finalproject

---

`machineInterface`: provides basic interface for dealing with the pop machine system

`threadManager`: provides a simple thread interface and manages controlling of our threads

`databaseManager`: provides an interface for using the database as well as manages it.

Instructions

$make controller
$make server     
$make sequel

Performing the above commands will place the app, webserver, and db sql script in outFolder (you may need to mkdir outFolder first).

This outFolder needs to be copied to the target (either through NFS public folder or by some other means)

On the Target:

Install Postgres on the target and follow the DBsetupTroubleshooting.txt to set up the database on the target. 

If you get an error then you potentially need to free up space on the target, run:
 #sudo apt-get remove --purge x11-common
 #sudo apt-get autoremove

Make sure Node is an updated stable version on the target:
 #sudo npm install n -g

For the latest stable version:
 #sudo n stable

Update/install packages (ensure you are in the webserver_src directory - may also do this on the host before copying outFolder to the target)
 #npm install 

Run: 
     # node server.js
     # ./controller.out
 
On Your Browser go to:  192.168.7.2:8088