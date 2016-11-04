Hi {{first}},
<br/>
remember that you have the followings employee with knowledge to approve:<br/>
{% for employee in employees %}
  {{employee.fullname}}<br/>
{% endfor %}
Please, click <a href="{{link|safe}}">here</a> to go to skillsearch/ and check it.

