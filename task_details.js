(function () {
  if ($(location).attr('href').indexOf('caselle.my.workfront.com/task/view') < 0 &&
    $(location).attr('href').indexOf('caselle.attask-ondemand.com/task/view') < 0) return;

    mainTask();
    window.setInterval(mainTask, 5000);
    _fastTask = window.setInterval(fastTask, 200);
})();

var _lastBuild = null;
var _fastTask;

function mainTask() {
  var taskLabel = $('span[sel-id="rightPanel_referenceNumber"]').last();
  if (!taskLabel.attr('data-task')) taskLabel.attr('data-task', taskLabel.html());

  $.each(['.02', '.05', '.08', '.11'], function (_, x) {
    getLastBuild(taskLabel.attr('data-task') + x, function(build) {
      _lastBuild = build;
      insertTaskDetails(build);
      insertBuildNumberButton(build)
    });
  });
}

function fastTask() {
  if (_lastBuild == null) return;
  insertBuildNumberButton(_lastBuild);
}

function insertBuildNumberButton(build) {
  if (!$('#buildButton').length)
  {
    var fixParent = $('li[name="DE:Build Number of Fix"]').last();
    if (fixParent == null) return;

    var input = fixParent.find('input');
    input.after('<button id="buildButton" class="btn btn-text text" style="padding-left: 10px;">Insert Build <span id="buildButtonNumber"/></button>');
  };
  var button = $('#buildButton');
  var buttonBuild = $('#buildButtonNumber');
  if (button.attr('data-build') == build.fullBuild) return;
  button.click(function() { input.val($(this).attr('data-build')); });
  button.attr('data-build', build.fullBuild);
  buttonBuild.text(build.fullBuild);
  buttonBuild.css('color', getColor(build));
}

function insertTaskDetails(build) {
  var taskLabel = $('span[sel-id="rightPanel_referenceNumber"]').last();

  var color = getColor(build);

  var div = $('#branch' + build.branch.replace('.', ''));
  if (div.length) {
    div.children('.build-number').css('color', color).text(build.label).attr('data-build', JSON.stringify(build));
    $('#branch' + build.branch.toString()).find('a').css('color', color).text(build.label).attr('data-build', JSON.stringify(build));
  } else {
    taskLabel.append('―');
    taskLabel.append('<span id="branch' + build.branch.replace('.', '') + '"></div>');
    div = $('#branch' + build.branch.replace('.', ''));
    $.get(chrome.extension.getURL('/templates/task_number.html'), function(data) {
      div.append(data);
      div.children('.build-number').css('color', color).text(build.label).attr('data-build', JSON.stringify(build));
      div.find('a').attr('href', 'https://github.com/caselle/Connect/commits/' + build.branch);
      div.find('img').attr('src', chrome.extension.getURL('/images/github.png'));
    });
  }
}
