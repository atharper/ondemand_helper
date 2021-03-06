chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  if (request.action == "xhttp") {
    var xhttp = new XMLHttpRequest();
    var method = request.method ? request.method.toUpperCase() : 'GET';

    xhttp.onload = function() {
        callback(xhttp.responseText);
    };
    xhttp.onerror = function() {
        // Do whatever you want on error. Don't forget to invoke the
        // callback to clean up the communication port.
        console.log(this);
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
  chrome.tabs.executeScript(null, { file: "jquery.min.js" }, function() {
    chrome.tabs.executeScript(null, { file: "commits.js" });
    chrome.tabs.executeScript(null, { file: "gocd.js" });
    chrome.tabs.executeScript(null, { file: "task_details.js" });
  });
});
