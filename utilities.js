function tryParseJSON (jsonString) {
  try {
    var o = JSON.parse(jsonString);
    if (o && typeof o === 'object') {
      return o;
    }
  }
  catch (e) { }
  return false;
}

function getColor (build) {
  if (build.state !== 'Completed') {
    return 'orange';
  } else if (build.result === 'Passed') {
    return 'green';
  } else if (build.result === 'Failed') {
    return 'red';
  }
  return '';
}

function getLastBuild(branch, funct, page) {
  page = page || 0;

  chrome.runtime.sendMessage({
    method: 'GET',
    action: 'xhttp',
    url: 'http://cctray:peekaboo$Treet@gocaselle:8153/go/api/pipelines/' + branch + '/history/' + page
  }, function (responseText) {
    var response = tryParseJSON(responseText);
    if (!response) return false;

    var pipeline = response.pipelines[0];
    funct({
      label: pipeline.label,
      state: pipeline.stages[0].jobs[0].state,
      result: pipeline.stages[0].jobs[0].result,
      branch: branch,
      fullBuild: branch + '.' + pipeline.label.split('.').pop(),
      infoLink: 'http://cctray:peekaboo$Treet@gocaselle:8153/go/pipelines/' + branch + '/' + pipeline.label.split('.').pop() + '/MSBuild/1'
    });
  });
}
var key = '';



function gitHubRequest(uri, funct, addHeaders) {
  chrome.storage.sync.get({
    key: '',
  }, function(items) {
    key = items.key;
    var request = new XMLHttpRequest();

    request.onload = function() {
      funct(tryParseJSON(this.responseText));
    };

    request.open('GET', 'https://api.github.com' + uri, true)
    request.setRequestHeader('Authorization', 'token ' + key);
    request.setRequestHeader('User-Agent', 'aluhadora');
    if (addHeaders) addHeaders(request);

    request.send()
  });
}
