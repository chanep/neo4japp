By: Juan José Cumba (juan.cumba@rga.com) <-- in case of need help
	Im on Slack too :-)


Configurations needs to use Vagrant Environment:
------------------------------------------------

1. Install Vagrant from the website:
	https://www.vagrantup.com/downloads.html

2. Install Virtual Box:
	https://www.virtualbox.org/wiki/Downloads

3. From skillsearch/vagrant-machine:
	vagrant up
		// first time may take a loooooong time

4. Config Neo4j to allow remote connections. As default Neo4j just allow local conn.
	vagrant ssh
		// to enter to guess machine

		// now inside the virtual machine
	cd /etc/neo4j/
	sudo vim neo4j.conf
		a. Uncomment line 50
		b. In line 57 replace 127.0.0.0:7473 by 0.0.0.0:7473
		c. Save and exit --> :wq
	exit
		// we are now in the host machine terminal
	vagrant reload
		// wait until finish rebooting

5. In the host machine, from some browser, enter to http://localhost:17474

6. Login with default password 'neo4j' and setup the new password for the database as 'root' (without quotes of course)