Hi {{first}},
<br/>
remember that you have the following employees with skills to approve:<br/>
{% for employee in employees %}
  {{employee.fullname}}<br/>
{% endfor %}
<br/>
Please, click <a href="{{link|safe}}">here</a> to go to skillsearch/ and check it.

