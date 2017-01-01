# JSONP is not JSON. It is a JavaScript program.  

```codes
Content-Type="application/javascript"

$.ajax({
    url: 'https://cdn.xgqfrms.xyz/json/badges.json',
    dataType: 'jsonp',
    success: function(data) {
        populateWithCourses(data.courses.completed);
        hide();
    }
});
``` 

```codes
Content-Type="application/json"

$.ajax({
    url: 'https://cdn.xgqfrms.xyz/json/badges.json',
    dataType: 'json',
    success: function(data) {
        populateWithCourses(data.courses.completed);
        hide();
    }
});
``` 

