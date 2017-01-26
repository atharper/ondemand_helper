chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  console.log("test");
  if (request.action == "xhttp") {
    console.log("hitting call");
      var xhttp = new XMLHttpRequest();
      var method = request.method ? request.method.toUpperCase() : 'GET';

      xhttp.onload = function() {
          callback(xhttp.responseText);
      };
      xhttp.onerror = function() {
          // Do whatever you want on error. Don't forget to invoke the
          // callback to clean up the communication port.
          callback();
      };
      xhttp.open(method, request.url, true);
      if (method == 'POST') {
          xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      }
      xhttp.send(request.data);
      return true; // prevents the callback from being called too early on return
  }
});

chrome.browserAction.onClicked.addListener(function(tab) {
  console.log("on click");
  chrome.tabs.executeScript(null, { file: "jquery.min.js" }, function() {
    chrome.tabs.executeScript(null, { file: "inject.js" });
  });
});
