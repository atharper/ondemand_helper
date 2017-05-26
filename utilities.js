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
  return false;
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
      infoLink: 'http://cctray:peekaboo$Treet@gocaselle:8153/go/pipelines/' + branch + '/' + pipeline.label.split('.').pop() + '/MSBuild/1'
    });
  });
}

function getBuilds(funct, branch, page) {
  page = page || 0;

  chrome.runtime.sendMessage({
    method: 'GET',
    action: 'xhttp',
    url: 'http://cctray:peekaboo$Treet@gocaselle:8153/go/api/pipelines/' + branch + '/history/' + page
  }, function (responseText) {
    var response = tryParseJSON(responseText);
    if (!response) return false;

    $.each(response.pipelines, function(i, pipeline) {
      $.each(pipeline.build_cause.material_revisions[0].modifications, function(j, modification) {
        funct()

        if (!dictionary[modification.revision]) dictionary[modification.revision] = {
          label: pipeline.label,
          state: pipeline.stages[0].jobs[0].state,
          result: pipeline.stages[0].jobs[0].result,
          branch: branch,
          infoLink: 'http://gocaselle:8153/go/pipelines/' + branch + '/' + pipeline.label.split('.').pop() + '/MSBuild/1'
        };
      });
    });

    refreshRun();
  });
}
