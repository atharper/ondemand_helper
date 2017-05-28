(function () {
  if ($(location).attr('href').indexOf('caselle.my.workfront.com/task/view') < 0 &&
    $(location).attr('href').indexOf('caselle.attask-ondemand.com/task/view') < 0) return;

  var taskLabel = $('.fnt-sm').last();

  $.each(['.02', '.05', '.08', '.11'], function (_, x) {
    getLastBuild(taskLabel.html() + x, function(build) {
      insertTaskDetails(build);
    });
  });
})();

function insertTaskDetails(build) {
  var taskLabel = $('.fnt-sm').last();

  var color = getColor(build);
  taskLabel.append('―');
  $.get(chrome.extension.getURL('/templates/task_number.html'), function(data) {
    taskLabel.append(data);
    taskLabel.children('.build-number').css('color', color ? color : '').text(build.label).attr('data-build', JSON.stringify(build));
    taskLabel.find('a').attr('href', 'https://github.com/caselle/Connect/commits/' + build.branch);
    taskLabel.find('img').attr('src', chrome.extension.getURL('/images/github.png'));

  });
}
