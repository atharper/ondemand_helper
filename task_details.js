(function () {
  if ($(location).attr('href').indexOf('caselle.my.workfront.com/task/view') < 0 &&
    $(location).attr('href').indexOf('caselle.attask-ondemand.com/task/view') < 0) return;

  var taskLabel = $('.fnt-sm').last();
  var branch = taskLabel.html() + '.11';

  chrome.runtime.sendMessage({
    method: 'GET',
    action: 'xhttp',
    url: 'http://cctray:peekaboo$Treet@gocaselle:8153/go/api/pipelines/' + branch + '/history/0'
  }, function (responseText) {
    var response = tryParseJSON(responseText);
    if (!response) return;

    var pipeline = response.pipelines[0];
    var build = {
      label: pipeline.label,
      state: pipeline.stages[0].jobs[0].state,
      result: pipeline.stages[0].jobs[0].result,
      branch: branch,
      infoLink: 'http://cctray:peekaboo$Treet@gocaselle:8153/go/pipelines/' + branch + '/' + pipeline.label.split('.').pop() + '/MSBuild/1'
    };

    var color = getColor(build);
    if (color) color = 'color: ' + color + ';';
    else color = '';
    taskLabel.append('---<span style="font-size: 12px;' + color + '">' + build.label + '</span>');
    // taskLabel.text(taskLabel.text() + ' ---- ' + build.label);
  });
})();
