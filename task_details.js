(function () {
  if ($(location).attr('href').indexOf('caselle.my.workfront.com/task/view') < 0 &&
    $(location).attr('href').indexOf('caselle.attask-ondemand.com/task/view') < 0) return;

    mainTask();
    window.setInterval(mainTask, 5000);
})();

function mainTask() {
  var taskLabel = $('span[sel-id="rightPanel_referenceNumber"]').last();
  if (!taskLabel.attr('data-task')) taskLabel.attr('data-task', taskLabel.html());

  $.each(['.02', '.05', '.08', '.11'], function (_, x) {
    getLastBuild(taskLabel.attr('data-task') + x, function(build) {
      insertTaskDetails(build);
    });
  });
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
