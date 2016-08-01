# R/GA Connected | Luigi Tasks repository

This repository aims to ease further work related to data processing, visualization, mining or machine-learning for internal projects, prototypes, research or learning.
The Python packages included here composes a set of Luigi tasks, which allows developers to easily scrap Company data from many different sources and make it ready for fast processing.


This initiative is part of research made from the Connected Work API Team willing to solve data integration problems based on our previous experince building the API and maintaining it.


Motivation: http://collab.rga.com:8090/confluence/display/RGACONNECT/API+Technical+Documentation?preview=/14171641/14179659/RGASpaceAPI-IntegrationsDocWIP%20(1).pdf (see Roadmap section)


The idea behind: https://www.youtube.com/watch?v=M0VCbhfQ3HQ (Facebook's DataSwarm)

Luigi github: https://github.com/spotify/luigi


## How to start

### Installation

```$ pip install luigi```

```$ luigid```

```$ open http://localhost:8082```

### Run Tasks

```$ luigi --module phonelist  --help-all```

#### Phonelist Data Examples

```$ export PYTHONPATH=''```

```$ luigi --module tasks GenerateRGAPhonelistAllEmployeesData```

```$ luigi --module tasks AggregateRGAPhonelistEmployeeData --AggregateRGAPhonelistEmployeeData-username gerardob```

```$ luigi --module tasks DownloadRGAPhonelistEmployeePhoto --DownloadRGAPhonelistEmployeePhoto-employee-id 42710```

```$ luigi --module phonelist DownloadRGAPhonelistEmployees```

```$ luigi --module phonelist DownloadRGAPhonelistEmployeeDetails --DownloadRGAPhonelistEmployeeDetails-employee-id {phonelistEmployeeId}```

```$ luigi --module phonelist DownloadRGAPhonelistEmployeeProjects --DownloadRGAPhonelistEmployeeProjects-employee-id {phonelistEmployeeId}```

```$ luigi --module phonelist DownloadRGAPhonelistEmployeeProjectsHistory --DownloadRGAPhonelistEmployeeProjecHistory-employee-id {phonelistEmployeeId}```

## Goals

1. Build massive datasets

2. Reduce / pack data into more meaningful datasets

3. Make this open to the internal developers network

4. Help the API data integration process based on the result of this work and future Luigi server installation.
