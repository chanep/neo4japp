from __future__ import print_function
import json
import requests
import luigi
import datetime
import re
import logging
import traceback

logger = logging.getLogger('luigi-interface')
PHONELIST_API_ORIGIN = 'http://phonelist'
PHONELIST_API_URL = PHONELIST_API_ORIGIN + '/gateway/json'

class DownloadRGAPhonelistEmployees(luigi.Task):

    date = luigi.DateParameter(default=datetime.date.today())

    def run(self):
        with self.output().open('w') as outfile:
            response = requests.get(PHONELIST_API_URL + '/employees.aspx', stream=True)
            if response.ok:
                for block in response.iter_content(1024):
                    outfile.write(block)

    def output(self):
        return luigi.LocalTarget(self.date.strftime('data/RGA/Phonelist/Employees_%Y-%m-%d.json'))


class DownloadRGAPhonelistEmployeesTenure(luigi.Task):

    date = luigi.DateParameter(default=datetime.date.today())

    def run(self):
        with self.output().open('w') as outfile:
            response = requests.get(PHONELIST_API_URL + '/empTenure.aspx', stream=True)
            if response.ok:
                for block in response.iter_content(1024):
                    outfile.write(block)

    def output(self):
        return luigi.LocalTarget(self.date.strftime('data/RGA/Phonelist/EmployeesTenure_%Y-%m-%d.json'))


class DownloadRGAPhonelistEmployeeDetails(luigi.Task):

    employee_id = luigi.IntParameter()
    date = luigi.DateParameter(default=datetime.date.today())

    def run(self):
        with self.output().open('w') as outfile:
            response = requests.get(PHONELIST_API_URL + '/employeeDetails.aspx?e=' + str(self.employee_id), stream=True)
            if response.ok:
                for block in response.iter_content(1024):
                    outfile.write(block)

    def output(self):
        return luigi.LocalTarget(self.date.strftime('data/RGA/Phonelist/EmployeeDetails/' + str(self.employee_id) + '_%Y-%m-%d.json'))


class DownloadRGAPhonelistEmployeeProjects(luigi.Task):

    employee_id = luigi.IntParameter()
    date = luigi.DateParameter(default=datetime.date.today())

    def run(self):
        with self.output().open('w') as outfile:
            response = requests.get(PHONELIST_API_URL + '/employeeProjects.aspx?e=' + str(self.employee_id), stream=True)
            if response.ok:
                for block in response.iter_content(1024):
                    outfile.write(block)

    def output(self):
        return luigi.LocalTarget(self.date.strftime('data/RGA/Phonelist/EmployeeProjects/' + str(self.employee_id) + '_%Y-%m-%d.json'))


class DownloadRGAPhonelistEmployeeProjectsHistory(luigi.Task):

    employee_id = luigi.IntParameter()
    date = luigi.DateParameter(default=datetime.date.today())

    def run(self):
        with self.output().open('w') as outfile:
            response = requests.get(PHONELIST_API_URL + '/employeeProjHist.aspx?e=' + str(self.employee_id), stream=True)
            if response.ok:
                for block in response.iter_content(1024):
                    outfile.write(block)

    def output(self):
        return luigi.LocalTarget(self.date.strftime('data/RGA/Phonelist/EmployeeProjectsHistory/' + str(self.employee_id) + '_%Y-%m-%d.json'))


class DownloadRGAPhonelistEmployeePhoto(luigi.Task):

    employee_id = luigi.IntParameter()
    date = luigi.DateParameter(default=datetime.date.today())
    username = 'UNDEFINED'
    file_extension = 'UNDEFINED'

    def requires(self):
        return DownloadRGAPhonelistEmployees(date=self.date)

    def run(self):
        with self.input().open('r') as jsonFile:
            inputdata = json.load(jsonFile)

        # initial ID lookup
        employees = [x for x in inputdata['employees'] if (x['ID'] == self.employee_id)]
        if len(employees) == 0:
            raise Exception('Cannot find employee given a user ID', 'ID=' + self.employee_id)
        employee = employees[0]

        photo_small_basepath = employee['photoURL']
        photo_small_url = PHONELIST_API_ORIGIN + photo_small_basepath
        photo_large_url = re.sub(r'S(\.[a-z]{3,4})$', '\\1', photo_small_url, flags=re.IGNORECASE)
        self.file_extension = re.sub(r'^.*(\.[a-z]{3,4})$', '\\1', photo_small_url, flags=re.IGNORECASE)
        self.username = employee['ADkey']

        with self.output()[0].open('w') as outfile:
            response = requests.get(photo_small_url, stream=True)
            if response.ok:
                for block in response.iter_content(1024):
                    outfile.write(block)

        with self.output()[1].open('w') as outfile:
            response = requests.get(photo_large_url, stream=True)
            if response.ok:
                for block in response.iter_content(1024):
                    outfile.write(block)

    def output(self):
        return [
            luigi.LocalTarget(self.date.strftime('data/RGA/Phonelist/EmployeePhotoSmall/' + self.username + '_%Y-%m-%d' + self.file_extension)),
            luigi.LocalTarget(self.date.strftime('data/RGA/Phonelist/EmployeePhotoLarge/' + self.username + '_%Y-%m-%d' + self.file_extension))
        ]


class AggregateRGAPhonelistEmployeeData(luigi.Task):

    username = luigi.Parameter()
    date = luigi.DateParameter(default=datetime.date.today())

    def requires(self):
        yield DownloadRGAPhonelistEmployees(date=self.date)
        yield DownloadRGAPhonelistEmployeesTenure(date=self.date)

    def run(self):
        with self.input()[0].open('r') as jsonFile:
            inputdata0 = json.load(jsonFile)
        with self.input()[1].open('r') as jsonFile:
            inputdata1 = json.load(jsonFile)

        # initial username/ADkey lookup
        employees = [x for x in inputdata0['employees'] if (x['ADkey'] == self.username)]
        if len(employees) == 0:
            raise Exception('Cannot find employee given a usernemae', 'username=' + self.username)
        employee = employees[0]        

        # ID lookup
        # @see http://luigi.readthedocs.io/en/stable/tasks.html#dynamic-dependencies
        employeeTenures = [x for x in inputdata1['Employees'] if (x['ID'] == employee['ID'])]
        if len(employeeTenures) == 0:
            raise Exception('Cannot find employee tenure given a user ID', 'username=' + self.username)
        employeeTenure = employeeTenures[0]


        details = DownloadRGAPhonelistEmployeeDetails(date=self.date, employee_id=employee['ID'])
        projects = DownloadRGAPhonelistEmployeeProjectsHistory(date=self.date, employee_id=employee['ID'])
        yield details
        yield projects


        with details.output().open('r') as jsonFile:
            inputdata2 = json.load(jsonFile)
        with projects.output().open('r') as jsonFile:
            inputdata3 = json.load(jsonFile)
        employeeDetails = inputdata2['Info']
        employeeProjects = inputdata3['Info']   

        self.username = employee['ADkey']

        outputdata = {
            'employee': employee,
            'employeeTenure': employeeTenure,
            'employeeDetails': employeeDetails,
            'employeeProjects': employeeProjects
        }
        with self.output().open('w') as outfile:
            json.dump(outputdata, outfile, sort_keys=True, indent=4, separators=(',', ': '))

    def output(self):
        return luigi.LocalTarget(self.date.strftime('data/RGA/Phonelist/Employee/' + self.username + '_%Y-%m-%d.json'))

class GenerateRGAPhonelistAllEmployeesData(luigi.Task):

    date = luigi.DateParameter(default=datetime.date.today())

    def requires(self):
        return DownloadRGAPhonelistEmployees(date=self.date)

    def run(self):

        with self.input().open('r') as jsonFile:
            inputdata0 = json.load(jsonFile)

        #deps = [AggregateRGAPhonelistEmployeeData(username=employee['ADkey']) for employee in inputdata0['employees']]
        deps = [AggregateRGAPhonelistEmployeeData(username=employee['ADkey']) for employee in inputdata0['employees'][0:3]]
        yield deps

        with self.output().open('w') as outfile:
            json.dump({ 'ok': True }, outfile, sort_keys=True, indent=4, separators=(',', ': '))

    def output(self):
        return luigi.LocalTarget(self.date.strftime('data/RGA/Phonelist/AllEmployees_%Y-%m-%d.json'))
