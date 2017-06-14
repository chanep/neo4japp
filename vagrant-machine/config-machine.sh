#Java dependencies needs for neo4j
sudo add-apt-repository ppa:webupd8team/java

sudo apt-get update
echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | sudo /usr/bin/debconf-set-selections
sudo apt-get -y install oracle-java8-installer
sudo apt-get -y -f install
#Installing Neo4j
wget -O - http://debian.neo4j.org/neotechnology.gpg.key | apt-key add -
echo 'deb http://debian.neo4j.org/repo stable/' > /etc/apt/sources.list.d/neo4j.list
sudo apt-get -y update
sudo apt-get -y install neo4j

#Install node and npm
wget https://nodejs.org/dist/v4.5.0/node-v4.5.0-linux-x64.tar.xz
sudo apt-get install xz-utils

tar -C /usr/local --strip-components 1 -xJf node-v4.5.0-linux-x64.tar.xz

#Installing ReactJS
sudo npm install webpack -g
sudo npm install webpack-dev-server -g
sudo npm install babel -g
#Installing other NodeJs packages
sudo npm install pm2 -g
sudo npm install grunt -g
#Checking status of Neo4j
service neo4j status
