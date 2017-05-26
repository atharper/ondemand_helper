(function () {
  if ($(location).attr('href').indexOf('caselle.my.workfront.com/task/view') < 0 &&
    $(location).attr('href').indexOf('caselle.attask-ondemand.com/task/view') < 0) return;

  var taskLabel = $('.fnt-sm').last();

  $.each(['.02', '.05', '.08', '.11'], function (_, x) {
    getLastBuild(taskLabel.html() + x, function(build) {
      var color = getColor(build);
      if (color) color = 'color: ' + color + ';';
      else color = '';
      taskLabel.append('---<span style="font-size: 12px;' + color + '">' + build.label + '</span>');
    })
  });
})();
