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
	sudo vim neo4j.conf (line numbers are approximate because they change from version to version)
		a. Uncomment line dbms.connectors.default_listen_address=0.0.0.0 (~line 45)
		b. Uncomment the line dbms.connector.https.listen_address=:7473 (~line 69)
		c. Uncomment if needed dbms.tx_log.rotation.retention_policy=7 days (~ line 100) and set 2 days
		d. Save and exit --> :wq
	exit
		// we are now in the host machine terminal
	vagrant reload
		// wait until finish rebooting

5. In the host machine, from some browser, enter to http://localhost:17474

6. Login with default password 'neo4j' and setup the new password for the database as 'root' (without quotes of course)
