var input = document.getElementById("new_comment_field");
console.log(input);
if (input) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://www.lgtm.in/g", true);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      var data = JSON.parse(xhr.responseText);
      console.log(data, data['markdown']);
      document.getElementById("new_comment_field").innerHTML += data['markdown'];
      console.log('LGTMed!', document.getElementById("new_comment_field").innerHTML);
    }
  };
  xhr.send();
}