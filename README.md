# Skill Search v2.0

## Architecture
![alt tag](https://gitlab.ny.rga.com/rga-api/skillsearch/raw/master/readme-imgs/architecture.png)

## DB Structure
![alt tag](https://gitlab.ny.rga.com/rga-api/skillsearch/raw/master/readme-imgs/db.png)

## Installing
Read and follow /vagrant-machine/readme.md file.

## Documentation
[Endpoints documentation](http://skillsearch2-qa:5005/apidoc/)

## Branchs
(we are not working with branch-per-feature but it's up to the developer)
* dev: to do everthing there
* qa: to push into qa site
* master: when new feature is ready

## Jenkins
[To deploy into production and qa site](http://skillsearch-ci/)
* qa-deploy-api: job to deploy the API into QA
* qa-deploy-front-end: job to deploy the front-end website into QA
* skillsearch2-deploy-api: job to deploy the API into production website
* skillsearch2-front-end: job to deploy the front-end website into production website
* (qa-exec-conf-scripts and skillsearch2-exec-conf-scripts should only be used to execute scripts into the servers)