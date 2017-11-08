function runWithDictionary(funct) {
  var branch = ''
  var dictionary = {};
  var $time_out_handle;

  var run = function () {
    funct(dictionary);
  };
  var refreshRun = function() {
    window.clearTimeout($time_out_handle);
    $time_out_handle = window.setTimeout(run, 40);
  }

  if ($(location).attr('href').indexOf('pull') > 0) {
    branch = $("span.css-truncate-target").last().html();
  } else {
    branch = $(location).attr('href').split('/').pop();
  }

  $.each(['2017.11', '2018.02', 'Development', branch], function (__, buildBranch) {
    $.each([0, 10, 20, 30, 40], function (_, x) {
      chrome.runtime.sendMessage({
        method: 'GET',
        action: 'xhttp',
        url: 'http://cctray:peekaboo$Treet@gocaselle:8153/go/api/pipelines/' + buildBranch + '/history/' + x
      }, function (responseText) {
        var response = tryParseJSON(responseText);
        if (!response) return;

        $.each(response.pipelines, function(i, pipeline) {
          $.each(pipeline.build_cause.material_revisions[0].modifications, function(j, modification) {
            if (!dictionary[modification.revision]) { 
              dictionary[modification.revision] = {
              label: pipeline.label,
              fullBuild: branch + '.' + pipeline.label.split('.').pop(),
              state: pipeline.stages[0].jobs[0].state,
              result: pipeline.stages[0].jobs[0].result,
              branch: branch,
              infoLink: 'http://cctray:peekaboo$Treet@gocaselle:8153/go/pipelines/' + buildBranch + '/' + pipeline.label.split('.').pop() + '/MSBuild/1',
              additionalBuilds: []
            }} else {
              dictionary[modification.revision].additionalBuilds.push({
                label: pipeline.label,
                fullBuild: branch + '.' + pipeline.label.split('.').pop(),
                state: pipeline.stages[0].jobs[0].state,
                result: pipeline.stages[0].jobs[0].result,
                branch: branch,
                infoLink: 'http://cctray:peekaboo$Treet@gocaselle:8153/go/pipelines/' + buildBranch + '/' + pipeline.label.split('.').pop() + '/MSBuild/1',
              });
            }
          });
        });

        refreshRun();
      });
    });
  });
}
